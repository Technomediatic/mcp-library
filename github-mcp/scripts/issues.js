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

async function manageIssues() {
    try {
        const action = await ask('🎯 Que voulez-vous faire ?\n1. Créer une issue\n2. Lister les issues\nChoix (1/2) : ');

        if (action === '1') {
            await createIssue();
        } else if (action === '2') {
            await listIssues();
        } else {
            console.log('❌ Choix invalide');
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        rl.close();
    }
}

async function createIssue() {
    const owner = await ask('👤 Propriétaire du dépôt (votre nom d\'utilisateur) : ');
    const repo = await ask('📁 Nom du dépôt : ');
    const title = await ask('📝 Titre de l\'issue : ');
    const body = await ask('📄 Description (optionnel) : ');

    console.log('\n⏳ Création de l\'issue...');

    const response = await octokit.rest.issues.create({
        owner: owner.trim(),
        repo: repo.trim(),
        title: title.trim(),
        body: body.trim() || undefined,
    });

    console.log('\n✅ Issue créée avec succès !');
    console.log(`🔗 URL: ${response.data.html_url}`);
    console.log(`#️⃣ Numéro: #${response.data.number}`);
}

async function listIssues() {
    const owner = await ask('👤 Propriétaire du dépôt : ');
    const repo = await ask('📁 Nom du dépôt : ');

    console.log('\n📋 Récupération des issues...\n');

    const response = await octokit.rest.issues.listForRepo({
        owner: owner.trim(),
        repo: repo.trim(),
        state: 'open',
        per_page: 20,
    });

    if (response.data.length === 0) {
        console.log('📭 Aucune issue ouverte trouvée');
        return;
    }

    console.log(`📊 ${response.data.length} issues ouvertes :\n`);

    response.data.forEach((issue, index) => {
        const labels = issue.labels.map(label => `🏷️ ${label.name}`).join(' ');
        const created = new Date(issue.created_at).toLocaleDateString();

        console.log(`${index + 1}. #${issue.number} ${issue.title}`);
        console.log(`   📅 Créée: ${created}`);
        if (labels) console.log(`   ${labels}`);
        console.log(`   🔗 ${issue.html_url}`);
        console.log('');
    });
}

manageIssues();
