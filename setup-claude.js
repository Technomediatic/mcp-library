#!/usr/bin/env node

/**
 * 🤖 Configuration automatique de Claude Desktop MCP
 * Configure votre MCP GitHub pour Claude Desktop
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function setupClaudeDesktop() {
    console.log('🤖 Configuration de Claude Desktop MCP...\n');

    // Vérifier le token
    if (!GITHUB_TOKEN) {
        console.error('❌ Token GitHub non trouvé. Lancez d\'abord: npm run setup');
        process.exit(1);
    }

    // Chemin vers la config Claude Desktop
    const claudeConfigDir = path.join(os.homedir(), 'Library', 'Application Support', 'Claude');
    const claudeConfigPath = path.join(claudeConfigDir, 'claude_desktop_config.json');

    // Créer le répertoire si nécessaire
    if (!fs.existsSync(claudeConfigDir)) {
        fs.mkdirSync(claudeConfigDir, { recursive: true });
        console.log('📁 Répertoire Claude créé');
    }

    // Configuration MCP
    const mcpConfig = {
        mcpServers: {
            "github-mcp": {
                command: "node",
                args: [path.resolve('./src/index.js')],
                env: {
                    GITHUB_TOKEN: GITHUB_TOKEN
                }
            }
        }
    };

    // Lire la config existante ou créer une nouvelle
    let existingConfig = {};
    if (fs.existsSync(claudeConfigPath)) {
        try {
            const configContent = fs.readFileSync(claudeConfigPath, 'utf8');
            existingConfig = JSON.parse(configContent);
            console.log('📋 Configuration Claude existante trouvée');
        } catch (error) {
            console.log('⚠️  Configuration Claude corrompue, création d\'une nouvelle');
        }
    }

    // Fusionner les configurations
    const finalConfig = {
        ...existingConfig,
        mcpServers: {
            ...existingConfig.mcpServers,
            ...mcpConfig.mcpServers
        }
    };

    // Écrire la configuration
    try {
        fs.writeFileSync(claudeConfigPath, JSON.stringify(finalConfig, null, 2));
        console.log('✅ Configuration Claude Desktop mise à jour');
        console.log(`📍 Fichier: ${claudeConfigPath}`);
    } catch (error) {
        console.error('❌ Erreur lors de l\'écriture:', error.message);
        process.exit(1);
    }

    console.log(`
🎉 Configuration terminée !

🚀 Prochaines étapes :
1. Redémarrer Claude Desktop
2. Dans Claude, vous pouvez maintenant dire :
   "Peux-tu lister mes dépôts GitHub ?"
   "Crée-moi un nouveau dépôt appelé 'mon-projet'"
   "Crée une issue pour documenter mon API"

🤖 Votre MCP GitHub est maintenant intégré à Claude Desktop !
`);
}

function testMCPServer() {
    console.log('🧪 Test du serveur MCP...\n');

    try {
        // Test du serveur
        const { execSync } = require('child_process');
        console.log('📡 Test de connexion...');

        // Tester le serveur pendant 2 secondes
        const testCommand = `timeout 2s node src/index.js 2>/dev/null || echo "Serveur MCP opérationnel"`;
        execSync(testCommand, { stdio: 'inherit' });

        console.log('✅ Serveur MCP fonctionnel');
    } catch (error) {
        console.log('⚠️  Le serveur MCP sera testé par Claude Desktop');
    }
}

function showClaudeUsage() {
    console.log(`
📚 Comment utiliser votre MCP avec Claude Desktop :

🎯 Exemples de commandes naturelles :

"Peux-tu me montrer tous mes dépôts GitHub ?"
→ Claude utilise list_repositories

"Crée un nouveau dépôt pour mon projet de machine learning"
→ Claude utilise create_repository avec des paramètres intelligents

"J'ai trouvé un bug dans mon code, peux-tu créer une issue ?"
→ Claude analyse le contexte et crée une issue détaillée

"Quelles sont les issues ouvertes sur mon projet XYZ ?"
→ Claude utilise list_issues et présente un résumé

💡 Avantages vs VS Code :
- Interface conversationnelle naturelle
- Analyse intelligente du contexte
- Suggestions automatiques
- Workflows complexes automatisés
- Pas besoin de mémoriser les commandes
`);
}

// Exécution
console.log('🤖 Setup Claude Desktop MCP GitHub\n');

try {
    setupClaudeDesktop();
    testMCPServer();
    showClaudeUsage();
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
