# Inburgering A1 — Préparation à l’examen de base à l’étranger

Application web (en français) pour préparer l’examen d’intégration néerlandais passé à l’étranger (niveau A1) :
société néerlandaise (KNS), lecture, vocabulaire, grammaire et écoute. Fonctionne sur téléphone, même hors ligne.

## Mettre en ligne sur GitHub Pages (une seule fois, ~5 minutes)

1. Créez un compte sur <https://github.com> si besoin.
2. Cliquez sur **New repository** (bouton « + » en haut à droite). Nom : par ex. `inburgering`. Choisissez **Public**, puis **Create repository**.
3. Sur la page du dépôt vide, cliquez sur **uploading an existing file**.
4. Décompressez le fichier zip sur votre ordinateur, puis **glissez tout le contenu du dossier** (pas le dossier lui-même : `index.html`, `sw.js`, les dossiers `js`, `css`, etc.) dans la page. Cliquez sur **Commit changes**.
5. Allez dans **Settings › Pages**. Sous « Branch », choisissez `main` et `/ (root)`, puis **Save**.
6. Après 1 à 2 minutes, l’adresse apparaît en haut de cette page : `https://VOTRE-NOM.github.io/inburgering/`.

Sur iPhone : ouvrez le lien dans Safari › bouton Partager › **Sur l’écran d’accueil**. L’application s’ouvre alors en plein écran et marche sans connexion.

## Mettre à jour

Ré-envoyez les fichiers modifiés de la même manière (« Add file › Upload files »). Dans `sw.js`, augmentez `VERSION` (ex. `v1.0.1`) pour que les téléphones reçoivent la nouvelle version.

## Vos progrès

Ils sont enregistrés dans le navigateur de l’appareil. **Réglages › Exporter** crée un fichier de sauvegarde, **Importer** le restaure (sur le même téléphone ou un autre).

## Structure du projet

```
index.html              page d’accueil de l’application
css/app.css             styles (générés, voir plus bas)
js/app.js               navigation et bandeau de progression
js/core/                moteur : sauvegarde, répétition espacée, voix, exercices
js/content/             TOUT le contenu pédagogique (modifiable sans toucher au code)
js/views/               les écrans
sw.js                   mode hors ligne
build/                  sources des styles (non nécessaires en ligne)
```

Pour ajouter des questions, modifiez les fichiers de `js/content/` en gardant le même format (chaque élément a un `id` unique).

## Regénérer les styles (seulement si vous ajoutez de nouvelles classes Tailwind)

Téléchargez l’outil autonome Tailwind v3 (<https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17>), puis, depuis le dossier du projet :

```
tailwindcss -c build/tailwind.config.js -i build/app.src.css -o css/app.css --minify
```

## Crédits

Icônes : Font Awesome Free (licence dans `vendor/fontawesome/LICENSE.txt`). Contenu vérifié en septembre 2026 ; les sites officiels (DUO, IND, Rijksoverheid) font foi.
