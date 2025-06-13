#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Configuration du serveur MCP GitHub\n');

rl.question('Entrez votre token GitHub personnel : ', (token) => {
    if (!token.trim()) {
        console.log('❌ Token requis !');
        process.exit(1);
    }

    const envContent = `GITHUB_TOKEN=${token.trim()}`;
    const envPath = path.join(process.cwd(), '.env');

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Configuration sauvegardée dans .env');
    console.log('\n📖 Instructions pour Claude Desktop :');
    console.log('1. Ouvrez votre fichier claude_desktop_config.json');
    console.log('2. Ajoutez cette configuration :');
    console.log(`
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["${path.join(process.cwd(), 'src', 'index.js')}"],
      "env": {
        "GITHUB_TOKEN": "${token.trim()}"
      }
    }
  }
}
`);
    console.log('3. Redémarrez Claude Desktop');
    console.log('\n🚀 Serveur prêt ! Testez avec : npm start');

    rl.close();
});
