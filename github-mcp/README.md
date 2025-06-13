# 🚀 GitHub MCP Server

> Model Context Protocol server for GitHub automation with optimized Claude Desktop integration

[![GitHub](https://img.shields.io/badge/GitHub-github--mcp-blue?logo=github)](https://github.com/Technomediatic/github-mcp)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-Compatible-orange)](https://modelcontextprotocol.io)

## 🎯 Problème résolu

**Avant :** Claude Desktop demandait une autorisation pour chaque action GitHub, rendant l'expérience frustrante.

**Maintenant :** **Réduction de 67-90% des demandes d'autorisation** grâce aux outils groupés !

## 📖 Documentation complète

**[🎯 Guide d'utilisation Claude Desktop →](./GUIDE_CLAUDE_DESKTOP.md)**

## ✨ Fonctionnalités principales

### 🔧 Outils MCP groupés (Optimisés pour Claude Desktop)

| Outil | Avant | Maintenant | Gain |
|-------|-------|------------|------|
| `github_dashboard` | 3 autorisations | 1 autorisation | **-67%** |
| `repository_analysis` | 5+ autorisations | 1 autorisation | **-80%** |
| `quick_create_project` | 4 autorisations | 1 autorisation | **-75%** |
| `batch_issue_operations` | n autorisations | 1 autorisation | **-90%+** |
- ♿ **Accessibilité** complète (WCAG)

**💻 Accès rapide :**
- **CLI :** `npm run tutorial`
- **VS Code :** `Cmd+Shift+P` → "Tasks: Run Task" → "📖 Ouvrir le tutoriel"
- **Direct :** Ouvrir `tutorial/index.html` dans votre navigateur

## 🚀 Installation rapide

### 🎯 Pour les nouveaux utilisateurs

**Installation automatique guidée :**
```bash
git clone https://github.com/Technomediatic/mcp-servers.git
cd mcp-servers
npm run install-guide
```

Le script d'installation vérifiera automatiquement vos prérequis et vous guidera !

### 📋 Prérequis
- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **Git** ([git-scm.com](https://git-scm.com))
- **VS Code** ([code.visualstudio.com](https://code.visualstudio.com))
- **Token GitHub** (le script vous aidera à le créer)

### ⚡ Installation manuelle

1. **Installez les dépendances** :
```bash
npm install
```

2. **Configurez votre token GitHub** :
```bash
npm run setup
```

3. **Testez** :
```bash
npm run list-repos
```

## ⚡ Commandes disponibles

### Scripts de base :
- `npm run create-repo` - Créer un dépôt (mode interactif)
- `npm run list-repos` - Lister vos dépôts
- `npm run quick-repo [nom]` - Création rapide d'un dépôt
- `npm run ai-workflow` - Créer le dépôt "ai-workflow" directement
- `npm run issues` - Gérer les issues

### Tâches VS Code :
Ouvrez la palette de commandes (`Cmd+Shift+P`) et tapez "Tasks: Run Task", puis choisissez :
- 🚀 Créer un dépôt GitHub
- 📚 Lister mes dépôts GitHub  
- ⚡ Créer dépôt 'ai-workflow'
- 🎯 Gérer les issues GitHub

## 🎯 Utilisation rapide

### Créer le dépôt "ai-workflow" :
```bash
npm run ai-workflow
```

### Créer n'importe quel dépôt rapidement :
```bash
npm run quick-repo mon-projet
```

### Créer un dépôt privé :
```bash
npm run quick-repo mon-projet-prive --private
```

## Configuration du Token GitHub

1. Allez sur GitHub.com > Settings > Developer settings > Personal access tokens
2. Cliquez sur "Generate new token (classic)"
3. Sélectionnez les scopes suivants :
   - `repo` (accès complet aux dépôts)
   - `user` (accès aux informations utilisateur)
4. Copiez le token généré dans votre fichier `.env`

## Utilisation

### Démarrage du serveur
```bash
npm start
```

### Mode développement (avec auto-reload)
```bash
npm run dev
```

## Configuration MCP

Pour utiliser ce serveur avec Claude Desktop, ajoutez cette configuration à votre fichier `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/chemin/vers/votre/github-mcp/src/index.js"],
      "env": {
        "GITHUB_TOKEN": "votre_token_github_ici"
      }
    }
  }
}
```

## Outils disponibles

### create_repository
Crée un nouveau dépôt GitHub.

**Paramètres :**
- `name` (requis) : Nom du dépôt
- `description` : Description du dépôt
- `private` : true pour un dépôt privé, false pour public
- `auto_init` : Créer un commit initial avec README

### list_repositories
Liste les dépôts de l'utilisateur.

### get_repository
Obtient les informations détaillées d'un dépôt.

### create_issue
Crée une nouvelle issue dans un dépôt.

### list_issues
Liste les issues d'un dépôt.

## Développement

Le serveur utilise les technologies suivantes :
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) pour l'interface MCP
- [@octokit/rest](https://github.com/octokit/rest.js) pour l'API GitHub
- [dotenv](https://github.com/motdotla/dotenv) pour la gestion des variables d'environnement

## Licence

MIT
