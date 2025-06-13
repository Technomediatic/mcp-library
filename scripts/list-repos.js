#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

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

async function listRepositories() {
    try {
        console.log('📚 Récupération de vos dépôts...\n');

        const response = await octokit.rest.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 30,
        });

        if (response.data.length === 0) {
            console.log('📭 Aucun dépôt trouvé');
            return;
        }

        console.log(`📊 ${response.data.length} dépôts trouvés :\n`);

        response.data.forEach((repo, index) => {
            const privacy = repo.private ? '🔒 Privé' : '🌐 Public';
            const language = repo.language ? `📝 ${repo.language}` : '📝 --';
            const stars = repo.stargazers_count > 0 ? `⭐ ${repo.stargazers_count}` : '';
            const updated = new Date(repo.updated_at).toLocaleDateString();

            console.log(`${index + 1}. ${repo.name} ${privacy}`);
            console.log(`   ${language} ${stars}`);
            console.log(`   📅 Mis à jour: ${updated}`);
            console.log(`   🔗 ${repo.html_url}`);
            if (repo.description) {
                console.log(`   📄 ${repo.description}`);
            }
            console.log('');
        });

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

listRepositories();
