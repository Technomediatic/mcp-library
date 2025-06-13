#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

// Load environment variables
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize Octokit
const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

async function createRepo() {
    try {
        console.log('🚀 Creating GitHub repository: mcp-library\n');

        // Create repository
        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: 'mcp-library',
            description: 'MCP Library - Collection of Model Context Protocol servers for various integrations and tools',
            public: true,
            auto_init: false,
            gitignore_template: 'Node',
            license_template: 'mit'
        });

        console.log('✅ Repository created successfully!');
        console.log(`📍 URL: ${response.data.html_url}`);
        console.log(`🔗 Clone URL: ${response.data.clone_url}`);

        // Add remote and push
        console.log('\n📤 Setting up remote and pushing...');

        try {
            execSync('git remote remove origin', { stdio: 'ignore' });
        } catch (e) {
            // Remote doesn't exist, that's fine
        }

        execSync(`git remote add origin ${response.data.clone_url}`);
        execSync('git branch -M main');
        execSync('git push -u origin main');

        console.log('✅ Code pushed to GitHub successfully!');
        console.log(`\n🎉 Your MCP Library is now available at: ${response.data.html_url}`);

    } catch (error) {
        if (error.status === 422) {
            console.error('❌ Repository "mcp-library" already exists');

            // Try to add remote anyway
            try {
                console.log('🔄 Attempting to connect to existing repository...');
                const user = await octokit.rest.users.getAuthenticated();
                const repoUrl = `https://github.com/${user.data.login}/mcp-library.git`;

                try {
                    execSync('git remote remove origin', { stdio: 'ignore' });
                } catch (e) {
                    // Remote doesn't exist, that's fine
                }

                execSync(`git remote add origin ${repoUrl}`);
                execSync('git push -u origin main');

                console.log('✅ Connected to existing repository and pushed!');
                console.log(`🎉 Your MCP Library is available at: https://github.com/${user.data.login}/mcp-library`);
            } catch (pushError) {
                console.error('❌ Failed to push to existing repository:', pushError.message);
            }
        } else {
            console.error('❌ Error creating repository:', error.message);
        }
    }
}

createRepo();
