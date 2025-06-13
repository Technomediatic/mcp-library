#!/usr/bin/env node

/**
 * 🔄 Opérations groupées GitHub MCP
 * Réduit les demandes d'autorisation en regroupant les actions
 */

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

/**
 * Dashboard complet GitHub - Une seule autorisation
 */
export async function getGitHubDashboard() {
    try {
        const [user, repos, notifications] = await Promise.all([
            octokit.rest.users.getAuthenticated(),
            octokit.rest.repos.listForAuthenticatedUser({
                sort: 'updated',
                per_page: 10
            }),
            octokit.rest.activity.listNotificationsForAuthenticatedUser({
                per_page: 5
            })
        ]);

        return {
            user: {
                login: user.data.login,
                name: user.data.name,
                public_repos: user.data.public_repos,
                followers: user.data.followers,
                following: user.data.following
            },
            recent_repos: repos.data.map(repo => ({
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                html_url: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                updated: repo.updated_at,
                private: repo.private
            })),
            notifications: notifications.data.map(notif => ({
                title: notif.subject.title,
                type: notif.subject.type,
                repository: notif.repository.full_name,
                updated: notif.updated_at
            }))
        };
    } catch (error) {
        throw new Error(`Erreur dashboard: ${error.message}`);
    }
}

/**
 * Analyse complète d'un repository - Une seule autorisation
 */
export async function getRepositoryAnalysis(owner, repo) {
    try {
        const [repository, issues, pulls, releases, contributors] = await Promise.all([
            octokit.rest.repos.get({ owner, repo }),
            octokit.rest.issues.listForRepo({ owner, repo, state: 'open', per_page: 10 }),
            octokit.rest.pulls.list({ owner, repo, state: 'open', per_page: 5 }),
            octokit.rest.repos.listReleases({ owner, repo, per_page: 3 }),
            octokit.rest.repos.listContributors({ owner, repo, per_page: 5 })
        ]);

        return {
            repository: {
                name: repository.data.name,
                full_name: repository.data.full_name,
                description: repository.data.description,
                html_url: repository.data.html_url,
                language: repository.data.language,
                stars: repository.data.stargazers_count,
                forks: repository.data.forks_count,
                open_issues: repository.data.open_issues_count,
                created: repository.data.created_at,
                updated: repository.data.updated_at,
                size: repository.data.size,
                default_branch: repository.data.default_branch
            },
            open_issues: issues.data.map(issue => ({
                number: issue.number,
                title: issue.title,
                state: issue.state,
                author: issue.user.login,
                created: issue.created_at,
                labels: issue.labels.map(label => label.name)
            })),
            pull_requests: pulls.data.map(pr => ({
                number: pr.number,
                title: pr.title,
                state: pr.state,
                author: pr.user.login,
                created: pr.created_at,
                draft: pr.draft
            })),
            releases: releases.data.map(release => ({
                tag_name: release.tag_name,
                name: release.name,
                published: release.published_at,
                prerelease: release.prerelease
            })),
            contributors: contributors.data.map(contributor => ({
                login: contributor.login,
                contributions: contributor.contributions,
                avatar_url: contributor.avatar_url
            }))
        };
    } catch (error) {
        throw new Error(`Erreur analyse repo: ${error.message}`);
    }
}

/**
 * Workflow de création rapide - Minimise les autorisations
 */
export async function quickCreateWorkflow(repoName, description, isPrivate = false, options = {}) {
    try {
        // Créer le repository sans auto_init pour éviter les conflits
        const repo = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            description: description,
            private: isPrivate,
            auto_init: false, // Changé pour éviter les conflits
            gitignore_template: options.gitignore || 'Node',
            license_template: options.license || 'mit'
        });

        // Attendre un peu pour que le repo soit prêt
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Si demandé, créer des fichiers de base
        const files = [];
        if (options.createReadme) {
            files.push({
                path: 'README.md',
                content: `# ${repoName}\n\n${description}\n\n## Installation\n\n\`\`\`bash\ngit clone ${repo.data.clone_url}\ncd ${repoName}\n\`\`\`\n`
            });
        }

        if (options.createPackageJson && options.projectType === 'node') {
            files.push({
                path: 'package.json',
                content: JSON.stringify({
                    name: repoName.toLowerCase(),
                    version: '1.0.0',
                    description: description,
                    main: 'index.js',
                    scripts: {
                        start: 'node index.js',
                        dev: 'nodemon index.js'
                    },
                    keywords: [],
                    author: '',
                    license: 'MIT'
                }, null, 2)
            });
        }

        // Créer le premier commit avec tous les fichiers
        if (files.length > 0) {
            // Créer un commit initial avec tous les fichiers
            const fileContents = files.map(file => ({
                path: file.path,
                content: file.content
            }));

            // Créer le premier fichier pour initialiser la branche
            const firstFile = fileContents[0];
            await octokit.rest.repos.createOrUpdateFileContents({
                owner: repo.data.owner.login,
                repo: repoName,
                path: firstFile.path,
                message: `Initial commit: Add ${firstFile.path}`,
                content: Buffer.from(firstFile.content).toString('base64')
            });

            // Ajouter les autres fichiers s'il y en a
            for (let i = 1; i < fileContents.length; i++) {
                const file = fileContents[i];
                await octokit.rest.repos.createOrUpdateFileContents({
                    owner: repo.data.owner.login,
                    repo: repoName,
                    path: file.path,
                    message: `Add ${file.path}`,
                    content: Buffer.from(file.content).toString('base64')
                });
            }
        }

        return {
            success: true,
            repository: {
                name: repo.data.name,
                full_name: repo.data.full_name,
                html_url: repo.data.html_url,
                clone_url: repo.data.clone_url,
                ssh_url: repo.data.ssh_url
            },
            files_created: files.map(f => f.path)
        };
    } catch (error) {
        throw new Error(`Erreur création workflow: ${error.message}`);
    }
}

/**
 * Gestion d'issues groupée
 */
export async function batchIssueOperations(owner, repo, operations = []) {
    try {
        const results = [];

        for (const operation of operations) {
            switch (operation.type) {
                case 'create':
                    const issue = await octokit.rest.issues.create({
                        owner,
                        repo,
                        title: operation.title,
                        body: operation.body,
                        labels: operation.labels || [],
                        assignees: operation.assignees || []
                    });
                    results.push({
                        type: 'created',
                        number: issue.data.number,
                        title: issue.data.title,
                        url: issue.data.html_url
                    });
                    break;

                case 'update':
                    const updated = await octokit.rest.issues.update({
                        owner,
                        repo,
                        issue_number: operation.number,
                        title: operation.title,
                        body: operation.body,
                        state: operation.state,
                        labels: operation.labels
                    });
                    results.push({
                        type: 'updated',
                        number: updated.data.number,
                        title: updated.data.title
                    });
                    break;

                case 'close':
                    await octokit.rest.issues.update({
                        owner,
                        repo,
                        issue_number: operation.number,
                        state: 'closed'
                    });
                    results.push({
                        type: 'closed',
                        number: operation.number
                    });
                    break;
            }
        }

        return {
            success: true,
            operations_completed: results.length,
            results: results
        };
    } catch (error) {
        throw new Error(`Erreur opérations issues: ${error.message}`);
    }
}

// Export pour utilisation CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const operation = process.argv[2];

    switch (operation) {
        case 'dashboard':
            getGitHubDashboard()
                .then(data => console.log(JSON.stringify(data, null, 2)))
                .catch(console.error);
            break;

        case 'analyze':
            const [owner, repo] = process.argv[3].split('/');
            getRepositoryAnalysis(owner, repo)
                .then(data => console.log(JSON.stringify(data, null, 2)))
                .catch(console.error);
            break;

        default:
            console.log('Usage: node batch-operations.js [dashboard|analyze owner/repo]');
    }
}
