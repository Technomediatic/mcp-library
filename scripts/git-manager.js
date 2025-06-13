#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    console.log('💡 Run: npm run setup');
    process.exit(1);
}

// Initialize Octokit
const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

// Project directory
const PROJECT_DIR = process.cwd();

function execCommand(command, silent = false) {
    try {
        const result = execSync(command, {
            cwd: PROJECT_DIR,
            encoding: 'utf8',
            stdio: silent ? 'pipe' : 'inherit'
        });
        return result;
    } catch (error) {
        if (!silent) {
            console.error(`❌ Erreur lors de l'exécution: ${command}`);
            console.error(error.message);
        }
        throw error;
    }
}

async function getUserInfo() {
    try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        return {
            username: user.login,
            email: user.email || `${user.login}@users.noreply.github.com`
        };
    } catch (error) {
        console.error('❌ Impossible de récupérer les informations utilisateur');
        throw error;
    }
}

function isGitRepo() {
    try {
        execCommand('git rev-parse --git-dir', true);
        return true;
    } catch {
        return false;
    }
}

function hasRemoteOrigin() {
    try {
        execCommand('git remote get-url origin', true);
        return true;
    } catch {
        return false;
    }
}

async function initGitRepo() {
    console.log('🔧 Initialisation du dépôt Git...\n');

    // Get user info from GitHub
    const userInfo = await getUserInfo();
    console.log(`👤 Utilisateur GitHub: ${userInfo.username}`);

    // Initialize git if not already done
    if (!isGitRepo()) {
        console.log('📁 Initialisation de Git...');
        execCommand('git init');

        // Configure git user
        execCommand(`git config user.name "${userInfo.username}"`);
        execCommand(`git config user.email "${userInfo.email}"`);
        console.log('✅ Git initialisé et configuré');
    } else {
        console.log('✅ Dépôt Git déjà initialisé');
    }

    // Create or update .gitignore
    const gitignorePath = path.join(PROJECT_DIR, '.gitignore');
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Build outputs
dist/
build/
`;

    if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log('📝 .gitignore créé');
    }

    return userInfo;
}

async function commitChanges(message = null) {
    const defaultMessage = `📦 Reorganize tutorial and clean up project structure

- Move tutorial files to dedicated tutorial/ directory
- Extract CSS and JS to separate files for better organization
- Update VS Code tasks to point to new tutorial location
- Remove legacy tutorial files
- Add comprehensive Git management script

🚀 Project now has clean structure and automated workflows`;

    const commitMessage = message || defaultMessage;

    console.log('📋 Ajout des fichiers au staging...');
    execCommand('git add .');

    console.log('💾 Création du commit...');
    execCommand(`git commit -m "${commitMessage}"`);

    console.log('✅ Commit créé avec succès');
}

async function linkToGitHub(repoName = 'mcp-servers') {
    const userInfo = await getUserInfo();

    if (hasRemoteOrigin()) {
        console.log('🔗 Remote origin déjà configuré');
        const remoteUrl = execCommand('git remote get-url origin', true).trim();
        console.log(`📍 Remote URL: ${remoteUrl}`);
        return;
    }

    // Check if repo exists
    try {
        await octokit.rest.repos.get({
            owner: userInfo.username,
            repo: repoName
        });
        console.log(`✅ Dépôt ${repoName} trouvé sur GitHub`);
    } catch (error) {
        if (error.status === 404) {
            console.log(`📦 Création du dépôt ${repoName} sur GitHub...`);
            await octokit.rest.repos.createForAuthenticatedUser({
                name: repoName,
                description: 'GitHub MCP Server - Model Context Protocol server for GitHub automation',
                private: false,
                auto_init: false
            });
            console.log('✅ Dépôt créé sur GitHub');
        } else {
            throw error;
        }
    }

    // Add remote origin
    const repoUrl = `https://${GITHUB_TOKEN}@github.com/${userInfo.username}/${repoName}.git`;
    console.log('🔗 Ajout du remote origin...');
    execCommand(`git remote add origin ${repoUrl}`);
    console.log(`📍 Remote origin ajouté: https://github.com/${userInfo.username}/${repoName}.git`);
}

async function pushToGitHub() {
    console.log('🚀 Push vers GitHub...');

    try {
        // Try to push, set upstream if needed
        execCommand('git push -u origin main');
    } catch (error) {
        // If main doesn't exist, try master
        try {
            execCommand('git branch -M main');
            execCommand('git push -u origin main');
        } catch (error2) {
            console.error('❌ Erreur lors du push');
            throw error2;
        }
    }

    console.log('✅ Code pushé vers GitHub avec succès');
}

async function getStatus() {
    console.log('📊 Statut Git:\n');

    try {
        const status = execCommand('git status --porcelain', true);
        const branch = execCommand('git branch --show-current', true).trim();

        console.log(`🌿 Branche actuelle: ${branch}`);

        if (status.trim()) {
            console.log('📝 Fichiers modifiés:');
            execCommand('git status --short');
        } else {
            console.log('✅ Aucun fichier modifié');
        }

        if (hasRemoteOrigin()) {
            const remoteUrl = execCommand('git remote get-url origin', true).trim();
            console.log(`🔗 Remote: ${remoteUrl}`);
        } else {
            console.log('⚠️  Aucun remote configuré');
        }

    } catch (error) {
        console.log('❌ Impossible de récupérer le statut Git');
    }
}

async function main() {
    const command = process.argv[2];
    const message = process.argv[3];

    console.log('🛠️  GitHub MCP - Git Manager\n');

    try {
        switch (command) {
            case 'init':
                await initGitRepo();
                break;

            case 'commit':
                await commitChanges(message);
                break;

            case 'link':
                const repoName = message || 'mcp-servers';
                await linkToGitHub(repoName);
                break;

            case 'push':
                await pushToGitHub();
                break;

            case 'deploy':
                console.log('🚀 Déploiement complet...\n');
                await initGitRepo();
                await commitChanges(message);
                await linkToGitHub('mcp-servers');
                await pushToGitHub();
                console.log('\n🎉 Déploiement terminé avec succès !');
                break;

            case 'status':
            default:
                await getStatus();
                break;
        }

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

// Show help if no command or help requested
if (process.argv.length === 2 || process.argv[2] === '--help' || process.argv[2] === '-h') {
    console.log(`🛠️  GitHub MCP - Git Manager

Usage: node scripts/git-manager.js <command> [args]

Commands:
  status              Afficher le statut Git (défaut)
  init                Initialiser le dépôt Git
  commit [message]    Créer un commit avec message optionnel
  link [repo-name]    Lier au dépôt GitHub (défaut: mcp-servers)
  push                Pousser vers GitHub
  deploy [message]    Déploiement complet (init + commit + link + push)

Examples:
  npm run git-status
  npm run git-init
  npm run git-commit "Mon message de commit"
  npm run git-deploy "Premier déploiement"
`);
    process.exit(0);
}

main();
