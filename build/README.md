# Assets de build

- `icon-source.png` — image source (matriochka)
- `icon.png` — PNG 512×512 généré (ne pas éditer à la main)
- `icon.ico` — icône Windows générée (ne pas éditer à la main)

Régénérer les icônes : `node scripts/make-icon.mjs`

Pour changer le logo, remplacez `icon-source.png` puis relancez la commande ci-dessus ou `npm run electron:build`.
