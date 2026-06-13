# Russe Apprendre

Application flashcards **français → russe** pour Windows.

## Fonctionnalités

- **Flashcards** avec le mot français devant et la traduction russe derrière
- **Espace** pour retourner la carte
- **Flèches ← →** pour naviguer entre les cartes
- **4 thèmes** : Verbes, Adjectifs, Noms, Mots de liaison
- **Verbes** : choix du temps (infinitif, présent, passé composé, imparfait, futur, impératif) avec phrase d'exemple FR/RU
- **Playlists** : Connu, À retenir, Pas connu — classez vos cartes après les avoir retournées
- Progression sauvegardée automatiquement (localStorage)

## Lancer l'application

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou plus)

### Installation

```bash
npm install
```

### Mode développement (navigateur)

```bash
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

### Application Windows (Electron)

```bash
npm start
```

Lance Vite + Electron en fenêtre native.

### Créer un installateur Windows (.exe)

```bash
npm run electron:build
```

L'installateur **`Russe Apprendre-Setup-1.0.0.exe`** sera généré dans le dossier `release/`.

Double-cliquez dessus pour installer l'application :
- raccourci **Bureau** et **Menu Démarrer**
- choix du dossier d'installation
- désinstallation via **Paramètres → Applications** ou le menu Démarrer
- vos playlists restent sauvegardées (localStorage) entre les sessions

Pour tester sans installer (dossier portable) :

```bash
npm run electron:build:dir
```

L'exécutable se trouve dans `release/win-unpacked/Russe Apprendre.exe`.

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Espace` | Retourner la flashcard |
| `V` | Prononcer le mot (FR ou RU selon la face) |
| `W` | Connu → carte suivante (verso visible) |
| `X` | À retenir → carte suivante (verso visible) |
| `C` | Pas connu → carte suivante (verso visible) |
| `←` | Carte précédente |
| `→` | Carte suivante |

## Vocabulaire

**796 cartes** réparties ainsi :
- **796 cartes** : 139 verbes, 198 adjectifs, 341 noms, 118 mots de liaison
- **Touche V** ou bouton Prononcer pour entendre la prononciation (français au recto, russe au verso)
- **W / X / C** pour classer la carte (connu / à retenir / pas connu) une fois retournée

Les mots sont dans `src/data/vocabulary/` — relancez `node scripts/generate-vocab.mjs` pour régénérer, ou éditez les fichiers directement.

**Prononciation** : utilise les voix Windows installées (fr-FR et ru-RU). Installez les voix dans Paramètres → Heure et langue → Voix si nécessaire.
