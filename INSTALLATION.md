# 🚀 Installation MCP GitHub Server

## 📋 Prérequis

### 1. **Logiciels requis**
- **Node.js** (v18+) - [nodejs.org](https://nodejs.org)
- **Git** - [git-scm.com](https://git-scm.com)
- **VS Code** - [code.visualstudio.com](https://code.visualstudio.com)
- **Compte GitHub** - [github.com](https://github.com)

### 2. **Token GitHub Personnel**
- Créer un Personal Access Token avec les scopes :
  - ✅ `repo` (accès complet aux dépôts)
  - ✅ `user` (informations utilisateur)
  - ✅ `workflow` (GitHub Actions)

## 🛠️ Installation

### Étape 1 : Cloner le projet
```bash
git clone https://github.com/Technomediatic/github-mcp.git
cd github-mcp
```

### Étape 2 : Installer les dépendances
```bash
npm install
```

### Étape 3 : Configuration du token
```bash
npm run setup
# Entrer votre token GitHub quand demandé
```

### Étape 4 : Test de fonctionnement
```bash
npm run list-repos
```

## 🎯 Utilisation dans VS Code

### Méthode 1 : Palette de commandes
1. `Cmd+Shift+P` (macOS) ou `Ctrl+Shift+P` (Windows/Linux)
2. Taper "Tasks: Run Task"
3. Sélectionner la tâche MCP désirée

### Méthode 2 : Terminal intégré
```bash
npm run create-repo    # Créer un dépôt
npm run list-repos     # Lister les dépôts
npm run issues         # Gérer les issues
```

## 📚 Documentation complète
Voir le tutoriel : `npm run tutorial`

## 🔧 Dépannage
Voir la section troubleshooting du tutoriel pour les problèmes courants.
