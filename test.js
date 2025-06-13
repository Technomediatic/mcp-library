#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

console.log('🧪 Test du serveur MCP GitHub\n');

const serverPath = path.join(process.cwd(), 'src', 'index.js');
const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
});

// Test message pour lister les outils
const testMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
}) + '\n';

server.stdin.write(testMessage);

let output = '';
server.stdout.on('data', (data) => {
    output += data.toString();

    try {
        const response = JSON.parse(output.trim());
        if (response.result && response.result.tools) {
            console.log('✅ Serveur MCP fonctionnel !');
            console.log(`📊 ${response.result.tools.length} outils disponibles :`);
            response.result.tools.forEach(tool => {
                console.log(`   • ${tool.name}: ${tool.description}`);
            });
            server.kill();
            process.exit(0);
        }
    } catch (e) {
        // En attente de plus de données
    }
});

server.stderr.on('data', (data) => {
    const message = data.toString();
    if (message.includes('GitHub MCP Server running')) {
        console.log('✅ Serveur démarré avec succès');
    } else if (message.includes('GITHUB_TOKEN')) {
        console.log('❌ Token GitHub manquant. Exécutez : npm run setup');
        server.kill();
        process.exit(1);
    }
});

server.on('error', (error) => {
    console.error('❌ Erreur du serveur :', error.message);
    process.exit(1);
});

// Timeout après 5 secondes
setTimeout(() => {
    console.log('⏱️  Timeout - vérifiez la configuration');
    server.kill();
    process.exit(1);
}, 5000);
