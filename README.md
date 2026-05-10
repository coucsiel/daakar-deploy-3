# 🍽 Daakar POS Pro v10
## Système de caisse · Le Daakar · Paris 18

---

## 🚀 Démarrage rapide (développement local)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en local (réseau local = utilisable sur tablette/téléphone)
npm run dev
# → http://localhost:3000
# → http://[votre-ip]:3000  (sur tablette du même réseau Wi-Fi)
```

---

## 🌐 Publier sur Internet (GRATUIT)

### Option A — Netlify (recommandé, le plus simple)

1. Créer un compte gratuit sur **https://netlify.com**
2. Cliquer **"Add new site"** → **"Import an existing project"**
3. Connecter votre dossier GitHub **OU** utiliser **"Deploy manually"**
4. Si deploy manuel :
   - Lancer `npm run build` → le dossier `dist/` est créé
   - Glisser-déposer le dossier `dist/` sur Netlify
   - ✅ Votre app est en ligne en 30 secondes

### Option B — Vercel (aussi gratuit)

```bash
npm install -g vercel
vercel
# Suivre les instructions → URL en ligne en 1 minute
```

### Option C — Hébergement classique (FTP/cPanel)

```bash
npm run build
# Uploader le contenu du dossier dist/ à la racine de votre hébergement
```

---

## 📱 Utilisation multi-appareils (réseau local)

Pour utiliser sur plusieurs tablettes/téléphones **sans Internet** :

```bash
npm run dev
# Ouvrir l'URL réseau affichée, ex: http://192.168.1.42:3000
```
→ Chaque tablette ouvre cette URL dans Chrome/Safari
→ La synchronisation fonctionne automatiquement (localStorage + events)

### Installer comme application (PWA)

Sur **iPhone/iPad** :
- Safari → Ouvrir l'URL → Partager → "Sur l'écran d'accueil"

Sur **Android** :
- Chrome → Menu ⋮ → "Ajouter à l'écran d'accueil"

---

## 🔐 Codes PIN par défaut

| Nom        | Rôle     | PIN  |
|------------|----------|------|
| Patron     | Admin    | 0000 |
| Amadou     | Serveur  | 1234 |
| Fatou      | Serveur  | 2345 |
| Ibrahima   | Serveur  | 3456 |
| Chef Omar  | Cuisine  | 5678 |
| Moussa     | Cuisine  | 6789 |

> ⚠️ Changez les PINs dans **Admin → Personnel** avant le service !

---

## 🎯 Fonctionnalités

- **3 rôles** : Admin · Serveur · Cuisine (accès séparés)
- **Plan des tables** avec statuts temps réel
- **Prise de commande** avec photos produits, stock, familles colorées
- **Envoi cuisine** avec filtre auto + impression ticket
- **Complément cuisine** : seuls les nouveaux articles sont envoyés
- **Interface cuisine** Kanban : Attente → Préparation → Prêt → Servi
- **Stock temps réel** : décrémentation à l'envoi, rejet si stock insuffisant
- **Photos de profil** et **badgeage** arrivée/départ
- **Fin de service** sécurisée : récap + confirmation PIN + impression rapport
- **Alertes** : tables ouvertes / additions non réglées à la déconnexion
- **Responsive** : ordinateur · tablette · téléphone
- **Design glassmorphism** premium avec animations

---

## 🛠 Stack technique

- **React 18** + **Vite 5**
- **localStorage** (persistance locale + sync multi-onglets)
- **CSS custom** (glassmorphism, no external UI lib)
- **0 dépendance** externe hormis React

---

## 📞 Contact

**Le Daakar** · Restaurant Franco-Sénégalais  
112 Rue Damrémont · 75018 Paris  
☎ 0758 199 260  
📸 @ledaakarparis18
