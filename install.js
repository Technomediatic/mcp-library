#!/usr/bin/env node

/**
 * 🚀 Installation automatique du MCP GitHub Server
 * Script pour faciliter l'installation par d'autres développeurs
 */

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

function runCommand(command, description) {
    console.log(`⏳ ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} terminé\n`);
    } catch (error) {
        console.error(`❌ Erreur lors de ${description.toLowerCase()}`);
        throw error;
    }
}

function checkPrerequisites() {
    console.log('🔍 Vérification des prérequis...\n');

    // Check Node.js
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        console.log(`✅ Node.js ${nodeVersion}`);
    } catch {
        console.error('❌ Node.js non installé. Veuillez l\'installer depuis https://nodejs.org');
        process.exit(1);
    }

    // Check Git
    try {
        const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
        console.log(`✅ ${gitVersion}`);
    } catch {
        console.error('❌ Git non installé. Veuillez l\'installer depuis https://git-scm.com');
        process.exit(1);
    }

    // Check VS Code (optional)
    try {
        execSync('code --version', { encoding: 'utf8', stdio: 'pipe' });
        console.log('✅ VS Code installé');
    } catch {
        console.log('⚠️  VS Code non détecté (optionnel)');
    }

    console.log('');
}

async function setupProject() {
    console.log('🛠️  Configuration du projet MCP GitHub...\n');

    // Install dependencies
    if (!fs.existsSync('node_modules')) {
        runCommand('npm install', 'Installation des dépendances');
    } else {
        console.log('✅ Dépendances déjà installées\n');
    }

    // Setup GitHub token
    if (!fs.existsSync('.env')) {
        console.log('🔑 Configuration du token GitHub...');
        const hasToken = await ask('Avez-vous déjà un Personal Access Token GitHub ? (y/n): ');

        if (hasToken.toLowerCase() === 'n') {
            console.log(`
📋 Pour créer un token GitHub :
1. Allez sur https://github.com/settings/tokens/new
2. Nom : "MCP GitHub Server"
3. Scopes requis :
   ✅ repo (accès complet aux dépôts)
   ✅ user (informations utilisateur)
   ✅ workflow (GitHub Actions)
4. Cliquez "Generate token"
5. Copiez le token généré
`);
            await ask('Appuyez sur Entrée quand vous avez votre token...');
        }

        runCommand('npm run setup', 'Configuration du token GitHub');
    } else {
        console.log('✅ Token GitHub déjà configuré\n');
    }
}

async function testInstallation() {
    console.log('🧪 Test de l\'installation...\n');

    try {
        console.log('📋 Test de connexion GitHub...');
        execSync('npm run list-repos', { stdio: 'inherit' });
        console.log('\n✅ Installation réussie !\n');
    } catch (error) {
        console.error('❌ Erreur lors du test. Vérifiez votre token GitHub.');
        throw error;
    }
}

function showUsageInstructions() {
    console.log(`
🎉 Installation terminée avec succès !

📚 Comment utiliser votre MCP GitHub :

🎯 Via VS Code :
   Cmd+Shift+P → "Tasks: Run Task" → Sélectionner une tâche MCP

⌨️  Via Terminal :
   npm run create-repo     # Créer un dépôt
   npm run list-repos      # Lister vos dépôts
   npm run issues          # Gérer les issues
   npm run tutorial        # Ouvrir le tutoriel

📖 Documentation complète :
   npm run tutorial

🔧 Support :
   Voir le tutoriel pour le dépannage et les exemples d'utilisation.

Bon développement ! 🚀
`);
}

async function main() {
    console.log(`
🚀 Installation MCP GitHub Server
==================================

Ce script va installer et configurer le serveur MCP GitHub
pour vous permettre de gérer GitHub directement depuis VS Code.

`);

    try {
        checkPrerequisites();
        await setupProject();
        await testInstallation();
        showUsageInstructions();

    } catch (error) {
        console.error('\n❌ Installation échouée. Veuillez consulter la documentation.');
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
