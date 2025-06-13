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

console.log('🚀 GitHub Repository Creator\n');

// Function to ask questions
function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function createRepository() {
    try {
        const name = await ask('📝 Nom du dépôt : ');
        if (!name.trim()) {
            console.log('❌ Le nom du dépôt est requis !');
            rl.close();
            return;
        }

        const description = await ask('📄 Description (optionnel) : ');

        const privateAnswer = await ask('🔒 Dépôt privé ? (y/N) : ');
        const isPrivate = privateAnswer.toLowerCase().startsWith('y');

        const initAnswer = await ask('📚 Créer un README initial ? (Y/n) : ');
        const autoInit = !initAnswer.toLowerCase().startsWith('n');

        console.log('\n⏳ Création du dépôt en cours...\n');

        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: name.trim(),
            description: description.trim() || undefined,
            private: isPrivate,
            auto_init: autoInit,
        });

        console.log('✅ Dépôt créé avec succès !\n');
        console.log(`📊 Détails :`);
        console.log(`   Nom: ${response.data.name}`);
        console.log(`   URL: ${response.data.html_url}`);
        console.log(`   Clone HTTPS: ${response.data.clone_url}`);
        console.log(`   Clone SSH: ${response.data.ssh_url}`);
        console.log(`   Privé: ${response.data.private ? 'Oui' : 'Non'}`);
        console.log(`   Créé: ${new Date(response.data.created_at).toLocaleString()}`);

        const cloneAnswer = await ask('\n💾 Voulez-vous cloner le dépôt localement ? (y/N) : ');
        if (cloneAnswer.toLowerCase().startsWith('y')) {
            const { spawn } = await import('child_process');

            console.log('\n⏳ Clonage en cours...');
            const cloneProcess = spawn('git', ['clone', response.data.clone_url], {
                stdio: 'inherit'
            });

            cloneProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(`\n✅ Dépôt cloné dans le dossier: ${response.data.name}`);
                    console.log(`💡 Pour ouvrir dans VS Code: code ${response.data.name}`);
                } else {
                    console.log('\n❌ Erreur lors du clonage');
                }
                rl.close();
            });
        } else {
            rl.close();
        }

    } catch (error) {
        console.error('\n❌ Erreur lors de la création:', error.message);
        if (error.status === 422) {
            console.log('💡 Ce nom de dépôt existe peut-être déjà');
        }
        rl.close();
    }
}

createRepository();
