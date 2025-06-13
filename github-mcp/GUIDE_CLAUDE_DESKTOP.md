# 🎯 Guide d'utilisation de votre serveur MCP GitHub avec Claude Desktop

## 🚀 Commandes disponibles dans Claude Desktop

Votre serveur MCP GitHub expose plusieurs outils que vous pouvez utiliser directement dans Claude Desktop. Voici comment les utiliser :

## 📊 **1. Tableau de bord GitHub**
```
Peux-tu me montrer mon tableau de bord GitHub complet ?
```
**Outil utilisé :** `github_dashboard`  
**Fonction :** Récupère toutes vos infos GitHub en une seule fois (profil, repos récents, notifications)

## 🔍 **2. Analyser un dépôt**
```
Peux-tu analyser mon dépôt "nom-du-repo" ?
```
**Outil utilisé :** `repository_analysis`  
**Fonction :** Analyse complète d'un dépôt (stats, issues, PRs, collaborateurs)

## ⚡ **3. Créer un projet rapide**
```
Crée-moi un nouveau projet appelé "mon-projet" avec une description "Mon nouveau projet"
```
**Outil utilisé :** `quick_create_project`  
**Fonction :** Création rapide de repo + fichiers de base + première issue

## 📋 **4. Gérer les issues en lot**
```
Peux-tu me lister toutes les issues ouvertes de mes repos et créer un rapport ?
```
**Outil utilisé :** `batch_issue_operations`  
**Fonction :** Opérations groupées sur les issues (liste, stats, fermetures en masse)

## 🏗️ **5. Créer un dépôt**
```
Crée un nouveau dépôt appelé "test-repo" qui sera privé
```
**Outil utilisé :** `create_repository`  
**Fonction :** Création de dépôt avec options avancées

## 📚 **6. Lister mes dépôts**
```
Montre-moi tous mes dépôts publics
```
**Outil utilisé :** `list_repositories`  
**Fonction :** Liste filtrée de vos dépôts

## 🔎 **7. Obtenir les détails d'un dépôt**
```
Donne-moi tous les détails du dépôt "mcp-library"
```
**Outil utilisé :** `get_repository`  
**Fonction :** Informations détaillées d'un dépôt spécifique

## 🐛 **8. Créer une issue**
```
Crée une nouvelle issue dans "mon-repo" avec le titre "Bug à corriger"
```
**Outil utilisé :** `create_issue`  
**Fonction :** Création d'issues avec labels et assignations

## 📝 **9. Lister les issues**
```
Liste toutes les issues ouvertes du dépôt "mon-repo"
```
**Outil utilisé :** `list_issues`  
**Fonction :** Liste filtrée des issues avec détails

## 💡 **Exemples de commandes naturelles**

### Commandes de surveillance
- "Quel est l'état de mes projets GitHub ?"
- "Y a-t-il des notifications importantes ?"
- "Quels sont mes repos les plus actifs ?"

### Commandes de création
- "Crée un nouveau projet pour une application React"
- "Initialise un repo pour mon portfolio"
- "Commence un projet avec une structure Node.js"

### Commandes de gestion
- "Ferme toutes les issues étiquetées 'duplicate'"
- "Crée une issue de bug dans mon projet principal"
- "Donne-moi un rapport sur l'activité de mes repos"

### Commandes d'analyse
- "Analyse la santé de mon dépôt principal"
- "Quels sont les problèmes non résolus ?"
- "Quel repo a le plus d'activité cette semaine ?"

## 🎛️ **Fonctionnalités avancées**

### Opérations groupées
Le serveur MCP optimise les appels API en groupant les opérations, ce qui réduit considérablement les demandes d'autorisation de Claude Desktop.

### Gestion d'erreurs
Toutes les commandes incluent une gestion d'erreur robuste et des messages informatifs.

### Configuration automatique
Le serveur lit automatiquement votre token GitHub depuis les variables d'environnement.

## 🔧 **Dépannage**

Si Claude ne répond pas aux commandes MCP :

1. **Vérifiez la configuration :**
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Testez le serveur :**
   ```bash
   cd /Users/mac10.11/Desktop/AI-Codes/-Github-Copilot/mcp-library/github-mcp
   node src/index.js
   ```

3. **Redémarrez Claude Desktop**

## 📈 **Conseils d'utilisation**

- **Soyez spécifique :** Mentionnez le nom exact du dépôt
- **Utilisez un langage naturel :** Claude comprend les intentions
- **Groupez les demandes :** "Analyse mes 3 derniers repos"
- **Demandez des rapports :** "Fais-moi un résumé de mon activité GitHub"

Votre serveur MCP GitHub est maintenant prêt à répondre à tous vos besoins d'automatisation GitHub ! 🚀
