# 🚀 GitHub MCP Server

Un serveur MCP (Model Context Protocol) pour l'automatisation GitHub avec Claude Desktop et VS Code, incluant des outils groupés pour réduire les demandes d'autorisation.

## 📖 Tutoriel HTML complet et interactif !

**✨ NOUVEAU !** Un tutoriel HTML moderne avec design responsive et fonctionnalités avancées :

```bash
npm run tutorial
```

**🎯 Fonctionnalités du tutoriel :**
- 📱 **Design responsive** optimisé mobile/desktop
- 🎨 **Interface moderne** avec animations fluides
- 📋 **Boutons de copie** pour tous les exemples de code
- 📊 **Statistiques animées** dans le pied de page
- 🧭 **Navigation latérale** intelligente (desktop)
- 📈 **Indicateur de progression** de lecture
- ⬆️ **Bouton retour en haut** flottant
- 🌙 **Mode sombre** automatique
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
