#!/usr/bin/env node

import { Octokit } from '../github-mcp/node_modules/@octokit/rest/index.js';
import dotenv from '../github-mcp/node_modules/dotenv/lib/main.js';

// Load environment variables from github-mcp
dotenv.config({ path: './github-mcp/.env' });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize Octokit
const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

async function createMCPLibraryRepo() {
    try {
        console.log('🚀 Création du dépôt MCP Library...\n');

        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: 'mcp-library',
            description: 'Collection de serveurs MCP (Model Context Protocol) pour diverses intégrations et outils',
            private: false,
            auto_init: false, // Nous avons déjà du contenu
        });

        console.log('✅ Dépôt créé avec succès !\n');
        console.log(`📊 Détails :`);
        console.log(`   Nom: ${response.data.name}`);
        console.log(`   URL: ${response.data.html_url}`);
        console.log(`   Clone HTTPS: ${response.data.clone_url}`);
        console.log(`   Clone SSH: ${response.data.ssh_url}`);
        console.log(`   Créé: ${new Date(response.data.created_at).toLocaleString()}`);

        // Configuration du remote Git
        console.log('\n⏳ Configuration Git...');
        const { spawn } = await import('child_process');

        return new Promise((resolve, reject) => {
            const gitRemote = spawn('git', ['remote', 'add', 'origin', response.data.clone_url], {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            gitRemote.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Remote Git configuré');

                    // Push initial
                    console.log('\n⏳ Déploiement initial...');
                    const gitPush = spawn('git', ['push', '-u', 'origin', 'main'], {
                        stdio: 'inherit',
                        cwd: process.cwd()
                    });

                    gitPush.on('close', (pushCode) => {
                        if (pushCode === 0) {
                            console.log('\n🎉 MCP Library déployée avec succès !');
                            console.log(`🌟 Visitez: ${response.data.html_url}`);
                            resolve();
                        } else {
                            console.log('\n⚠️ Erreur lors du push, mais le dépôt est créé');
                            resolve();
                        }
                    });
                } else {
                    console.log('\n⚠️ Erreur lors de la configuration du remote');
                    resolve();
                }
            });
        });

    } catch (error) {
        console.error('\n❌ Erreur lors de la création:', error.message);
        if (error.status === 422) {
            console.log('💡 Ce nom de dépôt existe peut-être déjà');
        }
    }
}

createMCPLibraryRepo();
