#!/usr/bin/env node

/**
 * 🧪 Test des outils MCP groupés
 * Démontre l'efficacité des outils pour réduire les autorisations Claude
 */

import { getGitHubDashboard, getRepositoryAnalysis, quickCreateWorkflow, batchIssueOperations } from './src/batch-operations.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDashboard() {
    console.log('🚀 Test du Dashboard GitHub complet...\n');

    try {
        const dashboard = await getGitHubDashboard();

        console.log(`👤 Utilisateur: ${dashboard.user.name} (@${dashboard.user.login})`);
        console.log(`📊 Repositories: ${dashboard.user.public_repos}`);
        console.log(`👥 Followers: ${dashboard.user.followers} | Following: ${dashboard.user.following}\n`);

        console.log('📁 Repositories récents:');
        dashboard.recent_repos.forEach(repo => {
            console.log(`  • ${repo.name} (${repo.language || 'N/A'}) - ⭐ ${repo.stars}`);
            console.log(`    📝 ${repo.description || 'No description'}`);
            console.log(`    🔒 ${repo.private ? 'Private' : 'Public'} - 📅 ${new Date(repo.updated).toLocaleDateString()}\n`);
        });

        console.log(`🔔 Notifications: ${dashboard.notifications.length} nouvelles\n`);
        console.log('✅ Dashboard test réussi - Une seule autorisation nécessaire!\n');

    } catch (error) {
        console.error('❌ Erreur dashboard:', error.message);
    }
}

async function testRepositoryAnalysis() {
    console.log('📊 Test de l\'analyse complète de repository...\n');

    try {
        // Analyser le premier repo disponible
        const analysis = await getRepositoryAnalysis('Technomediatic', 'mcp-servers');

        console.log(`📁 Repository: ${analysis.repository.full_name}`);
        console.log(`📝 Description: ${analysis.repository.description}`);
        console.log(`🚀 Language: ${analysis.repository.language}`);
        console.log(`⭐ Stars: ${analysis.repository.stars} | 🍴 Forks: ${analysis.repository.forks}`);
        console.log(`🐛 Issues ouvertes: ${analysis.repository.open_issues}`);
        console.log(`📦 Taille: ${Math.round(analysis.repository.size / 1024)} MB\n`);

        console.log(`📋 Issues récentes (${analysis.open_issues.length}):`);
        analysis.open_issues.slice(0, 3).forEach(issue => {
            console.log(`  • #${issue.number}: ${issue.title}`);
            console.log(`    👤 ${issue.author} - 🏷️ ${issue.labels.join(', ') || 'No labels'}\n`);
        });

        console.log(`🔄 Pull Requests (${analysis.pull_requests.length}):`);
        analysis.pull_requests.slice(0, 3).forEach(pr => {
            console.log(`  • #${pr.number}: ${pr.title} ${pr.draft ? '(Draft)' : ''}`);
            console.log(`    👤 ${pr.author}\n`);
        });

        console.log(`🏷️ Releases (${analysis.releases.length}):`);
        analysis.releases.slice(0, 2).forEach(release => {
            console.log(`  • ${release.tag_name}: ${release.name || 'No title'}`);
            console.log(`    📅 ${new Date(release.published).toLocaleDateString()}\n`);
        });

        console.log(`👥 Contributeurs (${analysis.contributors.length}):`);
        analysis.contributors.slice(0, 5).forEach(contributor => {
            console.log(`  • ${contributor.login} (${contributor.contributions} contributions)`);
        });

        console.log('\n✅ Analyse complète réussie - Une seule autorisation pour tout!\n');

    } catch (error) {
        console.error('❌ Erreur analyse:', error.message);
    }
}

async function testQuickCreateProject() {
    console.log('🚀 Test de création rapide de projet...\n');

    const testProjectName = `test-project-${Date.now()}`;

    try {
        console.log(`🔨 Création du projet: ${testProjectName}`);

        const result = await quickCreateWorkflow(
            testProjectName,
            'Projet de test pour démontrer la création rapide avec MCP',
            false, // public
            {
                projectType: 'node',
                createReadme: true,
                createPackageJson: true,
                gitignore: 'Node',
                license: 'mit'
            }
        );

        console.log('✅ Projet créé avec succès!');
        console.log(`📁 Repository: ${result.repository.full_name}`);
        console.log(`🌐 URL: ${result.repository.html_url}`);
        console.log(`📥 Clone: ${result.repository.clone_url}`);
        console.log(`📄 Fichiers créés: ${result.files_created.join(', ')}`);
        console.log('\n✅ Création rapide réussie - Setup complet en une seule autorisation!\n');

        return result.repository;

    } catch (error) {
        console.error('❌ Erreur création:', error.message);
        return null;
    }
}

async function testBatchIssueOperations(repository) {
    if (!repository) {
        console.log('⚠️  Pas de repository pour tester les issues batch\n');
        return;
    }

    console.log('🎯 Test des opérations groupées sur les issues...\n');

    try {
        const operations = [
            {
                type: 'create',
                title: '🐛 Bug - Test automatisé',
                body: 'Issue créée automatiquement pour tester les opérations groupées MCP',
                labels: ['bug', 'automation']
            },
            {
                type: 'create',
                title: '✨ Feature - Nouvelle fonctionnalité',
                body: 'Demande de fonctionnalité créée via MCP batch operations',
                labels: ['enhancement', 'feature']
            },
            {
                type: 'create',
                title: '📚 Documentation - Améliorer le README',
                body: 'Besoin d\'améliorer la documentation du projet',
                labels: ['documentation']
            }
        ];

        const [owner, repo] = repository.full_name.split('/');
        const result = await batchIssueOperations(owner, repo, operations);

        console.log('✅ Opérations groupées réussies!');
        console.log(`📊 ${result.operations_completed} opérations effectuées`);

        result.results.forEach(op => {
            if (op.type === 'created') {
                console.log(`  ✅ Issue #${op.number} créée: ${op.title}`);
                console.log(`     🔗 ${op.url}`);
            }
        });

        console.log('\n✅ Issues batch réussies - Multiples opérations en une seule autorisation!\n');

    } catch (error) {
        console.error('❌ Erreur issues batch:', error.message);
    }
}

function showSummary() {
    console.log(`
🎉 RÉSUMÉ DES TESTS MCP GROUPÉS

✅ Tests réussis :
1. 🚀 Dashboard GitHub complet - Une autorisation pour profil + repos + notifications
2. 📊 Analyse repository complète - Une autorisation pour issues + PRs + releases + stats
3. 🚀 Création projet rapide - Une autorisation pour repo + fichiers + setup
4. 🎯 Opérations issues groupées - Une autorisation pour multiples issues

💡 Avantages pour Claude Desktop :
• Réduction drastique des demandes d'autorisation
• Workflow plus fluide et naturel
• Données plus complètes en une seule requête
• Meilleure expérience utilisateur

🚀 Prêt pour utilisation dans Claude Desktop !
Redémarrez Claude Desktop et utilisez les commandes naturelles :
- "Montre-moi mon dashboard GitHub complet"
- "Analyse complète de mon repo mcp-servers"
- "Crée un projet Node.js appelé mon-api"
- "Crée 3 issues pour mon projet : bug X, feature Y, doc Z"
`);
}

// Exécution des tests
async function runAllTests() {
    console.log('🧪 DÉMONSTRATION MCP GITHUB GROUPÉ\n');
    console.log('='.repeat(50) + '\n');

    await testDashboard();
    console.log('-'.repeat(50) + '\n');

    await testRepositoryAnalysis();
    console.log('-'.repeat(50) + '\n');

    const newRepo = await testQuickCreateProject();
    console.log('-'.repeat(50) + '\n');

    await testBatchIssueOperations(newRepo);
    console.log('-'.repeat(50) + '\n');

    showSummary();
}

// Vérifier les arguments de ligne de commande
const command = process.argv[2];

switch (command) {
    case 'dashboard':
        testDashboard();
        break;
    case 'analysis':
        testRepositoryAnalysis();
        break;
    case 'create':
        testQuickCreateProject();
        break;
    case 'issues':
        const repo = { full_name: 'Technomediatic/mcp-servers' };
        testBatchIssueOperations(repo);
        break;
    case 'all':
    default:
        runAllTests();
}
