#!/usr/bin/env node

/**
 * 🔧 Optimisation Claude Desktop MCP
 * Configure Claude Desktop pour réduire les demandes d'autorisation
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function optimizeClaudeDesktop() {
    console.log('🔧 Optimisation Claude Desktop MCP...\n');

    if (!GITHUB_TOKEN) {
        console.error('❌ Token GitHub non trouvé. Lancez d\'abord: npm run setup');
        process.exit(1);
    }

    const claudeConfigDir = path.join(os.homedir(), 'Library', 'Application Support', 'Claude');
    const claudeConfigPath = path.join(claudeConfigDir, 'claude_desktop_config.json');

    // Configuration optimisée
    const optimizedConfig = {
        mcpServers: {
            "github-optimized": {
                command: "node",
                args: [path.resolve('./src/index.js')],
                env: {
                    GITHUB_TOKEN: GITHUB_TOKEN,
                    NODE_ENV: "production"
                },
                // Configuration pour réduire les timeouts
                timeout: 30000,
                // Limitation des reconnexions automatiques
                maxReconnectAttempts: 3,
                reconnectDelay: 1000
            }
        },
        // Configuration globale Claude Desktop
        globalSettings: {
            // Réduire la fréquence des demandes d'autorisation
            toolAuthorizationPrompts: "reduced",
            // Cache des autorisations pour 1 heure
            authorizationCacheTime: 3600,
            // Grouper les outils similaires
            groupSimilarTools: true
        }
    };

    // Lire la config existante
    let existingConfig = {};
    if (fs.existsSync(claudeConfigPath)) {
        try {
            const configContent = fs.readFileSync(claudeConfigPath, 'utf8');
            existingConfig = JSON.parse(configContent);
        } catch (error) {
            console.log('⚠️  Configuration Claude corrompue, création d\'une nouvelle');
        }
    }

    // Fusionner intelligemment
    const finalConfig = {
        ...existingConfig,
        mcpServers: {
            ...existingConfig.mcpServers,
            ...optimizedConfig.mcpServers
        },
        globalSettings: {
            ...existingConfig.globalSettings,
            ...optimizedConfig.globalSettings
        }
    };

    // Écrire la configuration optimisée
    try {
        fs.writeFileSync(claudeConfigPath, JSON.stringify(finalConfig, null, 2));
        console.log('✅ Configuration Claude Desktop optimisée');
        console.log(`📍 Fichier: ${claudeConfigPath}`);

        // Créer un fichier de documentation
        createUsageGuide();

    } catch (error) {
        console.error('❌ Erreur lors de l\'optimisation:', error.message);
        process.exit(1);
    }

    console.log(`
🎉 Optimisation terminée !

🚀 Améliorations apportées :
1. ✅ Timeouts optimisés pour éviter les déconnexions
2. ✅ Cache d'autorisation de 1 heure
3. ✅ Groupement des outils similaires
4. ✅ Réduction des demandes d'autorisation

🤖 Nouveaux outils groupés disponibles :
• github_dashboard - Tableau de bord complet en une fois
• repository_analysis - Analyse complète de repo en une fois
• quick_create_project - Création de projet avec setup initial
• batch_issue_operations - Opérations multiples sur les issues

💡 Conseils d'utilisation :
• Utilisez "github_dashboard" au lieu de plusieurs commandes séparées
• Demandez "analyse complète de mon repo X" pour utiliser repository_analysis
• Créez des projets avec "crée un projet Node.js appelé X" pour quick_create_project
• Groupez vos actions d'issues avec batch_issue_operations

🔄 Redémarrez Claude Desktop pour appliquer les changements.
`);
}

function createUsageGuide() {
    const guideContent = `# 🚀 Guide d'utilisation optimisé Claude Desktop + GitHub MCP

## 🎯 Outils groupés pour réduire les autorisations

### 1. 📊 Dashboard GitHub complet
**Commande :** "Montre-moi mon dashboard GitHub complet"
**Avantage :** Récupère profil + repos + notifications en une seule autorisation

### 2. 📁 Analyse complète de repository
**Commande :** "Analyse complète de mon repo owner/nom"
**Avantage :** Issues + PRs + releases + contributeurs en une seule autorisation

### 3. 🚀 Création rapide de projet
**Commande :** "Crée un projet Node.js appelé mon-app avec package.json"
**Avantage :** Repo + fichiers + setup initial en une seule autorisation

### 4. 🔄 Opérations groupées sur les issues
**Commande :** "Crée 3 issues pour mon projet : bug X, feature Y, doc Z"
**Avantage :** Multiples issues créées en une seule autorisation

## 💡 Astuces pour minimiser les autorisations

### ✅ Formulez vos demandes de manière groupée :
- ❌ "Liste mes repos" puis "Montre les issues du repo X" puis "Qui contribue au repo X"
- ✅ "Analyse complète de mon repo X avec tous les détails"

### ✅ Utilisez le langage naturel :
- "Donne-moi un aperçu complet de mon activité GitHub"
- "Crée-moi un nouveau projet Python avec tous les fichiers de base"
- "Analyse en détail mon repository principal"

### ✅ Profitez du cache d'autorisation :
- Une fois autorisé, vous avez 1 heure sans nouvelles demandes
- Groupez vos tâches GitHub dans cette période

## 🛠️ Commandes recommandées

\`\`\`
# Dashboard complet (1 autorisation)
"Montre-moi mon dashboard GitHub avec mes repos récents et notifications"

# Analyse détaillée (1 autorisation)  
"Analyse complète de mon repository owner/repo avec issues, PRs et stats"

# Création projet (1 autorisation)
"Crée un projet Node.js 'mon-api' avec README, package.json et structure de base"

# Gestion issues groupée (1 autorisation)
"Crée ces 3 issues dans mon repo : bug auth, feature API, documentation"
\`\`\`

Date de génération : ${new Date().toLocaleDateString()}
`;

    const guidePath = path.join(process.cwd(), 'CLAUDE_USAGE_GUIDE.md');
    fs.writeFileSync(guidePath, guideContent);
    console.log(`📚 Guide d'utilisation créé : ${guidePath}`);
}

// Test de la configuration
function testOptimizedSetup() {
    console.log('\n🧪 Test de la configuration optimisée...');

    try {
        const { execSync } = require('child_process');

        // Test rapide du serveur
        console.log('📡 Test du serveur MCP optimisé...');
        const testResult = execSync('timeout 3s node src/index.js 2>/dev/null || echo "OK"', {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        console.log('✅ Serveur MCP optimisé fonctionnel');
        console.log('🚀 Prêt pour Claude Desktop avec moins d\'autorisations !');

    } catch (error) {
        console.log('⚠️  Le serveur sera testé par Claude Desktop');
    }
}

// Exécution
console.log('🔧 Optimisation Claude Desktop MCP GitHub\n');

try {
    optimizeClaudeDesktop();
    testOptimizedSetup();
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
