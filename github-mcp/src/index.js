#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { getGitHubDashboard, getRepositoryAnalysis, quickCreateWorkflow, batchIssueOperations } from './batch-operations.js';

// Load environment variables
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize Octokit (GitHub API client)
const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

// Create MCP server
const server = new Server(
    {
        name: 'github-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'github_dashboard',
                description: 'Get complete GitHub dashboard with user info, recent repos, and notifications in one call - reduces authorization prompts',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'repository_analysis',
                description: 'Get complete repository analysis including issues, PRs, releases, and contributors in one call - reduces authorization prompts',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'Repository owner',
                        },
                        repo: {
                            type: 'string',
                            description: 'Repository name',
                        },
                    },
                    required: ['owner', 'repo'],
                },
            },
            {
                name: 'quick_create_project',
                description: 'Create a repository with initial setup (README, package.json, etc.) in one operation - reduces authorization prompts',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Repository name',
                        },
                        description: {
                            type: 'string',
                            description: 'Repository description',
                        },
                        private: {
                            type: 'boolean',
                            description: 'Whether the repository should be private',
                            default: false,
                        },
                        project_type: {
                            type: 'string',
                            enum: ['node', 'python', 'web', 'general'],
                            description: 'Type of project to set up',
                            default: 'general',
                        },
                        create_readme: {
                            type: 'boolean',
                            description: 'Create a README.md file',
                            default: true,
                        },
                        create_package_json: {
                            type: 'boolean',
                            description: 'Create package.json for Node.js projects',
                            default: false,
                        },
                        gitignore: {
                            type: 'string',
                            description: 'Gitignore template (Node, Python, etc.)',
                            default: 'Node',
                        },
                        license: {
                            type: 'string',
                            description: 'License template',
                            default: 'mit',
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'batch_issue_operations',
                description: 'Perform multiple issue operations (create, update, close) in one call - reduces authorization prompts',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'Repository owner',
                        },
                        repo: {
                            type: 'string',
                            description: 'Repository name',
                        },
                        operations: {
                            type: 'array',
                            description: 'List of operations to perform',
                            items: {
                                type: 'object',
                                properties: {
                                    type: {
                                        type: 'string',
                                        enum: ['create', 'update', 'close'],
                                        description: 'Operation type',
                                    },
                                    title: { type: 'string' },
                                    body: { type: 'string' },
                                    number: { type: 'number' },
                                    state: { type: 'string' },
                                    labels: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    },
                                },
                                required: ['type'],
                            },
                        },
                    },
                    required: ['owner', 'repo', 'operations'],
                },
            },
            {
                name: 'create_repository',
                description: 'Create a new GitHub repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Repository name',
                        },
                        description: {
                            type: 'string',
                            description: 'Repository description',
                        },
                        private: {
                            type: 'boolean',
                            description: 'Whether the repository should be private',
                            default: false,
                        },
                        auto_init: {
                            type: 'boolean',
                            description: 'Whether to create an initial commit with empty README',
                            default: true,
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'list_repositories',
                description: 'List user repositories',
                inputSchema: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['all', 'owner', 'public', 'private', 'member'],
                            description: 'Type of repositories to list',
                            default: 'owner',
                        },
                        sort: {
                            type: 'string',
                            enum: ['created', 'updated', 'pushed', 'full_name'],
                            description: 'Sort repositories by',
                            default: 'updated',
                        },
                        per_page: {
                            type: 'number',
                            description: 'Number of repositories per page',
                            default: 30,
                            maximum: 100,
                        },
                    },
                },
            },
            {
                name: 'get_repository',
                description: 'Get repository information',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'Repository owner',
                        },
                        repo: {
                            type: 'string',
                            description: 'Repository name',
                        },
                    },
                    required: ['owner', 'repo'],
                },
            },
            {
                name: 'create_issue',
                description: 'Create a new issue in a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'Repository owner',
                        },
                        repo: {
                            type: 'string',
                            description: 'Repository name',
                        },
                        title: {
                            type: 'string',
                            description: 'Issue title',
                        },
                        body: {
                            type: 'string',
                            description: 'Issue body/description',
                        },
                        labels: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Labels to add to the issue',
                        },
                    },
                    required: ['owner', 'repo', 'title'],
                },
            },
            {
                name: 'list_issues',
                description: 'List issues in a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'Repository owner',
                        },
                        repo: {
                            type: 'string',
                            description: 'Repository name',
                        },
                        state: {
                            type: 'string',
                            enum: ['open', 'closed', 'all'],
                            description: 'Issue state',
                            default: 'open',
                        },
                        per_page: {
                            type: 'number',
                            description: 'Number of issues per page',
                            default: 30,
                            maximum: 100,
                        },
                    },
                    required: ['owner', 'repo'],
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'github_dashboard': {
                const dashboard = await getGitHubDashboard();

                const reposList = dashboard.recent_repos.map(repo =>
                    `• ${repo.name} (${repo.language || 'N/A'}) - ⭐ ${repo.stars} - ${repo.private ? '🔒 Private' : '🌍 Public'}\n  ${repo.description || 'No description'}\n  📅 Updated: ${new Date(repo.updated).toLocaleDateString()}`
                ).join('\n\n');

                const notificationsList = dashboard.notifications.map(notif =>
                    `• ${notif.type}: ${notif.title}\n  📁 ${notif.repository}`
                ).join('\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `🚀 GitHub Dashboard for ${dashboard.user.name} (@${dashboard.user.login})\n\n` +
                                `📊 Profile Summary:\n` +
                                `• Repositories: ${dashboard.user.public_repos}\n` +
                                `• Followers: ${dashboard.user.followers}\n` +
                                `• Following: ${dashboard.user.following}\n\n` +
                                `📁 Recent Repositories (${dashboard.recent_repos.length}):\n\n${reposList}\n\n` +
                                `🔔 Recent Notifications (${dashboard.notifications.length}):\n\n${notificationsList || 'No recent notifications'}`,
                        },
                    ],
                };
            }

            case 'repository_analysis': {
                const { owner, repo } = args;
                const analysis = await getRepositoryAnalysis(owner, repo);

                const issuesList = analysis.open_issues.slice(0, 5).map(issue =>
                    `• #${issue.number}: ${issue.title}\n  👤 ${issue.author} - 📅 ${new Date(issue.created).toLocaleDateString()}\n  🏷️ ${issue.labels.join(', ') || 'No labels'}`
                ).join('\n\n');

                const prsList = analysis.pull_requests.map(pr =>
                    `• #${pr.number}: ${pr.title} ${pr.draft ? '(Draft)' : ''}\n  👤 ${pr.author} - 📅 ${new Date(pr.created).toLocaleDateString()}`
                ).join('\n\n');

                const releasesList = analysis.releases.slice(0, 3).map(release =>
                    `• ${release.tag_name}: ${release.name || 'No title'}\n  📅 ${new Date(release.published).toLocaleDateString()} ${release.prerelease ? '(Pre-release)' : ''}`
                ).join('\n\n');

                const contributorsList = analysis.contributors.slice(0, 5).map(contributor =>
                    `• ${contributor.login} (${contributor.contributions} contributions)`
                ).join('\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `📊 Repository Analysis: ${analysis.repository.full_name}\n\n` +
                                `📋 Repository Info:\n` +
                                `• Description: ${analysis.repository.description || 'No description'}\n` +
                                `• Language: ${analysis.repository.language || 'N/A'}\n` +
                                `• Stars: ⭐ ${analysis.repository.stars}\n` +
                                `• Forks: 🍴 ${analysis.repository.forks}\n` +
                                `• Open Issues: 🐛 ${analysis.repository.open_issues}\n` +
                                `• Size: 📦 ${Math.round(analysis.repository.size / 1024)} MB\n` +
                                `• Created: 📅 ${new Date(analysis.repository.created).toLocaleDateString()}\n` +
                                `• Last Updated: 📅 ${new Date(analysis.repository.updated).toLocaleDateString()}\n\n` +
                                `🐛 Recent Open Issues (${analysis.open_issues.length}):\n\n${issuesList || 'No open issues'}\n\n` +
                                `🔄 Open Pull Requests (${analysis.pull_requests.length}):\n\n${prsList || 'No open pull requests'}\n\n` +
                                `🏷️ Recent Releases (${analysis.releases.length}):\n\n${releasesList || 'No releases'}\n\n` +
                                `👥 Top Contributors (${analysis.contributors.length}):\n\n${contributorsList}`,
                        },
                    ],
                };
            }

            case 'quick_create_project': {
                const { name: repoName, description, private: isPrivate, project_type, create_readme, create_package_json, gitignore, license } = args;

                const options = {
                    projectType: project_type,
                    createReadme: create_readme,
                    createPackageJson: create_package_json,
                    gitignore,
                    license
                };

                const result = await quickCreateWorkflow(repoName, description, isPrivate, options);

                return {
                    content: [
                        {
                            type: 'text',
                            text: `🚀 Project Created Successfully!\n\n` +
                                `📁 Repository: ${result.repository.full_name}\n` +
                                `🌐 URL: ${result.repository.html_url}\n` +
                                `📥 Clone URL: ${result.repository.clone_url}\n` +
                                `🔑 SSH URL: ${result.repository.ssh_url}\n\n` +
                                `📄 Files Created:\n${result.files_created.map(file => `• ${file}`).join('\n')}\n\n` +
                                `✅ Your ${project_type} project is ready to go!\n\n` +
                                `🛠️ Next steps:\n` +
                                `1. Clone the repository: git clone ${result.repository.clone_url}\n` +
                                `2. Navigate to project: cd ${repoName}\n` +
                                `3. Start coding! 🎉`,
                        },
                    ],
                };
            }

            case 'batch_issue_operations': {
                const { owner, repo, operations } = args;
                const result = await batchIssueOperations(owner, repo, operations);

                const operationSummary = result.results.map(op => {
                    switch (op.type) {
                        case 'created':
                            return `✅ Created issue #${op.number}: ${op.title}\n   🔗 ${op.url}`;
                        case 'updated':
                            return `📝 Updated issue #${op.number}: ${op.title}`;
                        case 'closed':
                            return `✅ Closed issue #${op.number}`;
                        default:
                            return `ℹ️ ${op.type} operation on issue #${op.number}`;
                    }
                }).join('\n\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `🚀 Batch Operations Completed!\n\n` +
                                `📊 Summary:\n` +
                                `• Repository: ${owner}/${repo}\n` +
                                `• Operations completed: ${result.operations_completed}\n\n` +
                                `📋 Operations Details:\n\n${operationSummary}`,
                        },
                    ],
                };
            }

            case 'create_repository': {
                const { name: repoName, description, private: isPrivate, auto_init } = args;

                const response = await octokit.rest.repos.createForAuthenticatedUser({
                    name: repoName,
                    description,
                    private: isPrivate,
                    auto_init,
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Repository created successfully!\n\n` +
                                `Name: ${response.data.name}\n` +
                                `URL: ${response.data.html_url}\n` +
                                `Clone URL: ${response.data.clone_url}\n` +
                                `Private: ${response.data.private ? 'Yes' : 'No'}\n` +
                                `Created: ${response.data.created_at}`,
                        },
                    ],
                };
            }

            case 'list_repositories': {
                const { type, sort, per_page } = args;

                const response = await octokit.rest.repos.listForAuthenticatedUser({
                    type,
                    sort,
                    per_page,
                });

                const repoList = response.data.map(repo =>
                    `• ${repo.name} (${repo.private ? 'Private' : 'Public'}) - ${repo.html_url}`
                ).join('\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Found ${response.data.length} repositories:\n\n${repoList}`,
                        },
                    ],
                };
            }

            case 'get_repository': {
                const { owner, repo } = args;

                const response = await octokit.rest.repos.get({
                    owner,
                    repo,
                });

                const repo_data = response.data;
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Repository Information:\n\n` +
                                `Name: ${repo_data.full_name}\n` +
                                `Description: ${repo_data.description || 'No description'}\n` +
                                `URL: ${repo_data.html_url}\n` +
                                `Private: ${repo_data.private ? 'Yes' : 'No'}\n` +
                                `Stars: ${repo_data.stargazers_count}\n` +
                                `Forks: ${repo_data.forks_count}\n` +
                                `Language: ${repo_data.language || 'Not specified'}\n` +
                                `Created: ${repo_data.created_at}\n` +
                                `Updated: ${repo_data.updated_at}`,
                        },
                    ],
                };
            }

            case 'create_issue': {
                const { owner, repo, title, body, labels } = args;

                const response = await octokit.rest.issues.create({
                    owner,
                    repo,
                    title,
                    body,
                    labels,
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Issue created successfully!\n\n` +
                                `Title: ${response.data.title}\n` +
                                `Number: #${response.data.number}\n` +
                                `URL: ${response.data.html_url}\n` +
                                `State: ${response.data.state}`,
                        },
                    ],
                };
            }

            case 'list_issues': {
                const { owner, repo, state, per_page } = args;

                const response = await octokit.rest.issues.listForRepo({
                    owner,
                    repo,
                    state,
                    per_page,
                });

                const issueList = response.data.map(issue =>
                    `• #${issue.number}: ${issue.title} (${issue.state}) - ${issue.html_url}`
                ).join('\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Found ${response.data.length} issues:\n\n${issueList}`,
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
