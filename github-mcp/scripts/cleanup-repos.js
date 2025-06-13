#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import readline from 'readline';

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Repositories to keep (whitelist)
const REPOS_TO_KEEP = ['mcp-library', 'ai-workflow'];

// Repositories to delete (identified from the list)
const REPOS_TO_DELETE = [
    'github-mcp',
    'test-project-1749808980044',
    'test-project-1749562771392',
    'test-project-1749562755497',
    'test-project-1749562514212',
    'mcp-servers'
];

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function deleteRepositories() {
    try {
        console.log('🗑️  Nettoyage des dépôts GitHub\n');

        console.log('📋 Dépôts à CONSERVER :');
        REPOS_TO_KEEP.forEach(repo => {
            console.log(`   ✅ ${repo}`);
        });

        console.log('\n📋 Dépôts à SUPPRIMER :');
        REPOS_TO_DELETE.forEach(repo => {
            console.log(`   ❌ ${repo}`);
        });

        const confirm = await ask('\n⚠️  Êtes-vous sûr de vouloir supprimer ces dépôts ? (tapez "SUPPRIMER" pour confirmer) : ');

        if (confirm !== 'SUPPRIMER') {
            console.log('🚫 Opération annulée par l\'utilisateur');
            rl.close();
            return;
        }

        console.log('\n🔄 Suppression en cours...\n');

        for (const repoName of REPOS_TO_DELETE) {
            try {
                console.log(`⏳ Suppression de ${repoName}...`);

                await octokit.rest.repos.delete({
                    owner: 'Technomediatic', // Remplacez par votre nom d'utilisateur
                    repo: repoName,
                });

                console.log(`✅ ${repoName} supprimé avec succès`);

            } catch (error) {
                if (error.status === 404) {
                    console.log(`⚠️  ${repoName} n'existe pas ou déjà supprimé`);
                } else {
                    console.error(`❌ Erreur lors de la suppression de ${repoName}:`, error.message);
                }
            }
        }

        console.log('\n🎉 Nettoyage terminé !');
        console.log('\n📊 Dépôts restants :');
        REPOS_TO_KEEP.forEach(repo => {
            console.log(`   ✅ ${repo}`);
        });

        // Vérification finale
        const verifyAnswer = await ask('\n🔍 Voulez-vous vérifier la liste finale des dépôts ? (y/N) : ');
        if (verifyAnswer.toLowerCase().startsWith('y')) {
            console.log('\n📚 Vérification de vos dépôts restants...');
            const repos = await octokit.rest.repos.listForAuthenticatedUser({
                sort: 'updated',
                per_page: 100
            });

            console.log(`\n📊 ${repos.data.length} dépôts restants :`);
            repos.data.forEach((repo, index) => {
                const visibility = repo.private ? '🔒 Privé' : '🌐 Public';
                console.log(`${index + 1}. ${repo.name} ${visibility}`);
            });
        }

        rl.close();

    } catch (error) {
        console.error('\n❌ Erreur générale:', error.message);
        rl.close();
    }
}

deleteRepositories();
