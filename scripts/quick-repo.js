#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import readline from 'readline';

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function quickCreateRepo() {
    try {
        // Quick setup for ai-workflow specifically
        if (process.argv[2] === 'ai-workflow') {
            console.log('🚀 Création rapide du dépôt "ai-workflow"...\n');

            const response = await octokit.rest.repos.createForAuthenticatedUser({
                name: 'ai-workflow',
                description: 'AI workflow automation project',
                private: true,
                auto_init: true,
            });

            console.log('✅ Dépôt "ai-workflow" créé avec succès !\n');
            console.log(`🔗 URL: ${response.data.html_url}`);
            console.log(`📋 Clone: git clone ${response.data.clone_url}`);

            return;
        }

        // Interactive mode
        const repoName = process.argv[2] || await ask('📝 Nom du dépôt : ');
        const isPrivate = process.argv.includes('--private') || process.argv.includes('-p');

        if (!repoName || !repoName.trim()) {
            console.log('❌ Le nom du dépôt est requis !');
            rl.close();
            return;
        }

        console.log(`\n⏳ Création du dépôt "${repoName}"...`);

        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            private: isPrivate,
            auto_init: true,
        });

        console.log('✅ Dépôt créé avec succès !\n');
        console.log(`🔗 URL: ${response.data.html_url}`);
        console.log(`📋 Clone: git clone ${response.data.clone_url}`);

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        if (error.status === 422) {
            console.log('💡 Ce nom de dépôt existe peut-être déjà');
        }
    } finally {
        rl.close();
    }
}

quickCreateRepo();
