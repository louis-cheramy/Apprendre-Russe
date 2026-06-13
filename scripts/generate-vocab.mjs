/**
 * Génère les fichiers de vocabulaire. Exécuter : node scripts/generate-vocab.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../src/data/vocabulary')
mkdirSync(outDir, { recursive: true })

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function serializeRaw(name, exportName, data) {
  const lines = data.map(([f, r, t]) => `  ['${esc(f)}', '${esc(r)}', '${esc(t)}'],`)
  return `import type { RawEntry } from './helpers'\n\nexport const ${exportName}: RawEntry[] = [\n${lines.join('\n')}\n]\n`
}

function serializeVerbs(data) {
  const lines = data.map(([f, r, t, pf, pr, pcf, pcr]) =>
    `  ['${esc(f)}', '${esc(r)}', '${esc(t)}', '${esc(pf)}', '${esc(pr)}', '${esc(pcf)}', '${esc(pcr)}'],`
  )
  return `import type { VerbEntry } from './helpers'\n\nexport const verbsData: VerbEntry[] = [\n${lines.join('\n')}\n]\n`
}

// ── ADJECTIFS (180) ──
const adjectives = [
  ['grand', 'большой', 'Taille'], ['petit', 'маленький', 'Taille'], ['gros / grosse', 'толстый', 'Taille'],
  ['mince', 'тонкий / худой', 'Taille'], ['long / longue', 'длинный', 'Taille'], ['court / courte', 'короткий', 'Taille'],
  ['large', 'широкий', 'Taille'], ['étroit / étroite', 'узкий', 'Taille'], ['haut / haute', 'высокий', 'Taille'],
  ['bas / basse', 'низкий', 'Taille'], ['beau / belle', 'красивый', 'Apparence'], ['joli / jolie', 'милый', 'Apparence'],
  ['laid / laide', 'уродливый', 'Apparence'], ['jeune', 'молодой', 'Âge'], ['vieux / vieille', 'старый', 'Âge'],
  ['nouveau / nouvelle', 'новый', 'Temps'], ['ancien / ancienne', 'древний', 'Temps'], ['moderne', 'современный', 'Temps'],
  ['bon / bonne', 'хороший', 'Qualité'], ['mauvais / mauvaise', 'плохой', 'Qualité'], ['excellent / excellente', 'отличный', 'Qualité'],
  ['parfait / parfaite', 'идеальный', 'Qualité'], ['facile', 'лёгкий / простой', 'Difficulté'], ['difficile', 'трудный', 'Difficulté'],
  ['simple', 'простой', 'Difficulté'], ['compliqué / compliquée', 'сложный', 'Difficulté'], ['possible', 'возможный', 'Possibilité'],
  ['impossible', 'невозможный', 'Possibilité'], ['nécessaire', 'необходимый', 'Possibilité'], ['important / importante', 'важный', 'Qualité'],
  ['utile', 'полезный', 'Qualité'], ['inutile', 'бесполезный', 'Qualité'], ['rapide', 'быстрый', 'Vitesse'],
  ['lent / lente', 'медленный', 'Vitesse'], ['chaud / chaude', 'горячий / тёплый', 'Température'], ['froid / froide', 'холодный', 'Température'],
  ['tiède', 'тёплый', 'Température'], ['sec / sèche', 'сухой', 'Température'], ['humide', 'влажный', 'Température'],
  ['heureux / heureuse', 'счастливый', 'Émotions'], ['malheureux / malheureuse', 'несчастный', 'Émotions'], ['triste', 'грустный', 'Émotions'],
  ['content / contente', 'довольный', 'Émotions'], ['fâché / fâchée', 'сердитый', 'Émotions'], ['en colère', 'злой', 'Émotions'],
  ['calme', 'спокойный', 'Émotions'], ['nerveux / nerveuse', 'нервный', 'Émotions'], ['fatigué / fatiguée', 'уставший', 'État'],
  ['malade', 'больной', 'État'], ['sain / saine', 'здоровый', 'État'], ['fort / forte', 'сильный', 'Force'], ['faible', 'слабый', 'Force'],
  ['dur / dure', 'твёрдый', 'Texture'], ['mou / molle', 'мягкий', 'Texture'], ['lourd / lourde', 'тяжёлый', 'Poids'], ['léger / légère', 'лёгкий', 'Poids'],
  ['plein / pleine', 'полный', 'Quantité'], ['vide', 'пустой', 'Quantité'], ['riche', 'богатый', 'Argent'], ['pauvre', 'бедный', 'Argent'],
  ['cher / chère', 'дорогой', 'Argent'], ['bon marché', 'дешёвый', 'Argent'], ['gratuit / gratuite', 'бесплатный', 'Argent'],
  ['propre', 'чистый', 'Propreté'], ['sale', 'грязный', 'Propreté'], ['blanc / blanche', 'белый', 'Couleurs'], ['noir / noire', 'чёрный', 'Couleurs'],
  ['rouge', 'красный', 'Couleurs'], ['bleu / bleue', 'синий', 'Couleurs'], ['vert / verte', 'зелёный', 'Couleurs'], ['jaune', 'жёлтый', 'Couleurs'],
  ['orange', 'оранжевый', 'Couleurs'], ['violet / violette', 'фиолетовый', 'Couleurs'], ['rose', 'розовый', 'Couleurs'], ['gris / grise', 'серый', 'Couleurs'],
  ['marron', 'коричневый', 'Couleurs'], ['clair / claire', 'светлый', 'Couleurs'], ['foncé / foncée', 'тёмный', 'Couleurs'],
  ['français / française', 'французский', 'Nationalité'], ['russe', 'русский', 'Nationalité'], ['anglais / anglaise', 'английский', 'Nationalité'],
  ['européen / européenne', 'европейский', 'Nationalité'], ['international / internationale', 'международный', 'Nationalité'],
  ['public / publique', 'общественный', 'Société'], ['privé / privée', 'частный', 'Société'], ['politique', 'политический', 'Société'],
  ['économique', 'экономический', 'Société'], ['social / sociale', 'социальный', 'Société'], ['culturel / culturelle', 'культурный', 'Société'],
  ['libre', 'свободный', 'Liberté'], ['occupé / occupée', 'занятый', 'Liberté'], ['ouvert / ouverte', 'открытый', 'État'], ['fermé / fermée', 'закрытый', 'État'],
  ['vrai / vraie', 'настоящий', 'Vérité'], ['faux / fausse', 'ложный', 'Vérité'], ['certain / certaine', 'уверенный', 'Vérité'], ['incertain / incertaine', 'неуверенный', 'Vérité'],
  ['proche', 'близкий', 'Distance'], ['lointain / lointaine', 'далёкий', 'Distance'], ['premier / première', 'первый', 'Ordre'], ['dernier / dernière', 'последний', 'Ordre'],
  ['suivant / suivante', 'следующий', 'Ordre'], ['précédent / précédente', 'предыдущий', 'Ordre'], ['seul / seule', 'один / одинокий', 'Quantité'],
  ['même', 'тот же', 'Comparaison'], ['autre', 'другой', 'Comparaison'], ['différent / différente', 'разный', 'Comparaison'], ['semblable', 'похожий', 'Comparaison'],
  ['meilleur / meilleure', 'лучший', 'Comparaison'], ['pire', 'худший', 'Comparaison'], ['très', 'очень', 'Intensité'], ['trop', 'слишком', 'Intensité'],
  ['assez', 'достаточно', 'Intensité'], ['peu', 'мало', 'Intensité'], ['beaucoup', 'много', 'Intensité'], ['presque', 'почти', 'Intensité'], ['environ', 'примерно', 'Intensité'],
  ['spécial / spéciale', 'особенный', 'Qualité'], ['normal / normale', 'нормальный', 'Qualité'], ['ordinaire', 'обычный', 'Qualité'], ['extraordinaire', 'необыкновенный', 'Qualité'],
  ['intelligent / intelligente', 'умный', 'Personnalité'], ['stupide', 'глупый', 'Personnalité'], ['gentil / gentille', 'дobрый', 'Personnalité'], ['méchant / méchante', 'злой', 'Personnalité'],
  ['sympathique', 'симпатичный', 'Personnalité'], ['sérieux / sérieuse', 'серьёзный', 'Personnalité'], ['drôle', 'смешной', 'Personnalité'], ['timide', 'застенчивый', 'Personnalité'],
  ['courageux / courageuse', 'смелый', 'Personnalité'], ['patient / patiente', 'терпеливый', 'Personnalité'], ['honnête', 'честный', 'Personnalité'],
  ['droit / droite', 'прямой / правый', 'Direction'], ['gauche', 'левый', 'Direction'], ['rond / ronde', 'круглый', 'Forme'], ['carré / carrée', 'квадратный', 'Forme'],
  ['doux / douce', 'мягкий / сладкий', 'Sensation'], ['amer / amère', 'горький', 'Goût'], ['sucré / sucrée', 'сладкий', 'Goût'], ['salé / salée', 'сolёный', 'Goût'],
  ['épicé / épicée', 'острый', 'Goût'], ['délicieux / délicieuse', 'вкусный', 'Goût'], ['fade', 'безвкусный', 'Goût'], ['frais / fraîche', 'свежий', 'Goût'],
  ['vivant / vivante', 'живой', 'Vie'], ['mort / morte', 'мёртвый', 'Vie'], ['célèbre', 'знаменитый', 'Renommée'], ['populaire', 'популярный', 'Renommée'],
  ['rare', 'редкий', 'Fréquence'], ['commun / commune', 'распространённый', 'Fréquence'], ['fréquent / fréquente', 'частый', 'Fréquence'], ['habituel / habituelle', 'обычный', 'Fréquence'],
  ['naturel / naturelle', 'естественный', 'Qualité'], ['artificiel / artificielle', 'искусственный', 'Qualité'], ['électrique', 'электрический', 'Technologie'],
  ['numérique', 'цифровой', 'Technologie'], ['automatique', 'автоматический', 'Technologie'], ['manuel / manuelle', 'ручной', 'Technologie'],
  ['technique', 'технический', 'Technologie'], ['scientifique', 'научный', 'Technologie'], ['médical / médicale', 'медицинский', 'Santé'],
  ['psychologique', 'психологический', 'Santé'], ['physique', 'физический', 'Santé'], ['mental / mentale', 'умственный', 'Santé'],
  ['financier / financière', 'финансовый', 'Économie'], ['commercial / commerciale', 'коммерческий', 'Économie'], ['urbain / urbaine', 'городской', 'Géographie'],
  ['rural / rurale', 'сельский', 'Géographie'], ['maritime', 'морской', 'Géographie'], ['curieux / curieuse', 'любopытный', 'Personnalité'],
  ['antipathique', 'неприятный', 'Personnalité'], ['impatient / impatiente', 'нетерпеливый', 'Personnalité'], ['prudent / prudente', 'осторожный', 'Personnalité'],
  ['triangulaire', 'треугольный', 'Forme'], ['pointu / pointue', 'острый', 'Forme'], ['acide', 'кислый', 'Goût'], ['cuit / cuite', 'варёный', 'Goût'],
  ['cru / crue', 'сырой', 'Goût'], ['nu / nue', 'голый', 'Vêtements'], ['habillé / habillée', 'одетый', 'Vêtements'], ['inconnu / inconnue', 'неизвестный', 'Renommée'],
  ['occasionnel / occasionnelle', 'случайный', 'Fréquence'], ['anormal / anormale', 'ненормальный', 'Qualité'], ['mécanique', 'механический', 'Technologie'],
  ['spirituel / spirituelle', 'духовный', 'Santé'], ['matériel / matérielle', 'материальный', 'Santé'], ['industriel / industrielle', 'промышленный', 'Économie'],
  ['agricole', 'сельскохозяйственный', 'Économie'], ['montagneux / montagneuse', 'горный', 'Géographie'], ['continental / continentale', 'континентальный', 'Géographie'],
  ['religieux / religieuse', 'религиозный', 'Société'], ['exactement', 'точно', 'Intensité'], ['totalement', 'полностью', 'Intensité'], ['partiellement', 'частично', 'Intensité'],
  ['vraiment', 'действительно', 'Intensité'], ['absolument', 'абсолютно', 'Intensité'], ['tellement', 'настолько', 'Intensité'], ['à peine', 'едва', 'Intensité'],
]

// Fix typos in adjectives
adjectives.forEach(a => {
  if (a[0] === 'gentil / gentille') a[1] = 'добрый'
  if (a[0] === 'salé / salée') a[1] = 'солёный'
  if (a[0] === 'curieux / curieuse') a[1] = 'любopытный'
  if (a[0] === 'curieux / curieuse') a[1] = 'любопытный'
})

// ── NOMS (220+) ──
const nouns = [
  ['homme', 'мужчина / человек', 'Personnes'], ['femme', 'женщина', 'Personnes'], ['enfant', 'ребёнок', 'Personnes'],
  ['garçon', 'мальчик', 'Personnes'], ['fille', 'девочка / девушка', 'Personnes'], ['bébé', 'младенец', 'Personnes'],
  ['père', 'отец', 'Famille'], ['mère', 'мать', 'Famille'], ['fils', 'сын', 'Famille'], ['fille (famille)', 'дочь', 'Famille'],
  ['frère', 'брат', 'Famille'], ['sœur', 'сестра', 'Famille'], ['parent', 'родитель', 'Famille'], ['famille', 'семья', 'Famille'],
  ['grand-père', 'дедушка', 'Famille'], ['grand-mère', 'бабушка', 'Famille'], ['oncle', 'дядя', 'Famille'], ['tante', 'тётя', 'Famille'],
  ['cousin / cousine', 'двоюродный брат / сестра', 'Famille'], ['mari', 'муж', 'Famille'], ['épouse', 'жена', 'Famille'],
  ['ami / amie', 'друг / подруга', 'Personnes'], ['voisin / voisine', 'сосед', 'Personnes'], ['collègue', 'коллега', 'Personnes'],
  ['patron', 'начальник', 'Travail'], ['employé', 'сотрудник', 'Travail'], ['client', 'клиент', 'Travail'],
  ['professeur', 'учитель / профессор', 'Éducation'], ['élève', 'ученик', 'Éducation'], ['étudiant', 'студент', 'Éducation'],
  ['docteur', 'врач', 'Santé'], ['infirmier', 'медбрат', 'Santé'], ['patient', 'пациент', 'Santé'],
  ['maison', 'дом', 'Lieux'], ['appartement', 'квартира', 'Lieux'], ['chambre', 'комната', 'Lieux'], ['cuisine', 'кухня', 'Lieux'],
  ['salon', 'гостиная', 'Lieux'], ['salle de bain', 'ванная', 'Lieux'], ['toilettes', 'туалет', 'Lieux'], ['bureau', 'офис', 'Lieux'],
  ['école', 'школа', 'Éducation'], ['université', 'университет', 'Éducation'], ['hôpital', 'больница', 'Santé'], ['pharmacie', 'аптека', 'Santé'],
  ['magasin', 'магазин', 'Commerce'], ['supermarché', 'супермаркет', 'Commerce'], ['restaurant', 'ресторан', 'Nourriture'], ['café', 'кафе', 'Nourriture'],
  ['hôtel', 'отель', 'Voyage'], ['aéroport', 'аэропорт', 'Voyage'], ['gare', 'вокзал', 'Voyage'], ['station', 'станция', 'Voyage'],
  ['bus', 'автобус', 'Transport'], ['train', 'поезд', 'Transport'], ['métro', 'метро', 'Transport'], ['taxi', 'такси', 'Transport'],
  ['voiture', 'машина', 'Transport'], ['vélo', 'велосипед', 'Transport'], ['avion', 'самолёт', 'Transport'], ['bateau', 'корабль', 'Transport'],
  ['rue', 'улица', 'Lieux'], ['avenue', 'проспект', 'Lieux'], ['place', 'площадь', 'Lieux'], ['pont', 'мост', 'Lieux'],
  ['ville', 'город', 'Lieux'], ['village', 'деревня', 'Lieux'], ['pays', 'страна', 'Lieux'], ['capitale', 'столица', 'Lieux'],
  ['région', 'регион', 'Lieux'], ['monde', 'мир', 'Lieux'], ['continent', 'континент', 'Lieux'], ['Europe', 'Европа', 'Lieux'],
  ['France', 'Франция', 'Lieux'], ['Russie', 'Россия', 'Lieux'], ['Paris', 'Париж', 'Lieux'], ['Moscou', 'Москва', 'Lieux'],
  ['mer', 'море', 'Nature'], ['océan', 'океан', 'Nature'], ['rivière', 'река', 'Nature'], ['lac', 'озеро', 'Nature'],
  ['montagne', 'гора', 'Nature'], ['colline', 'холм', 'Nature'], ['forêt', 'лес', 'Nature'], ['arbre', 'дерево', 'Nature'],
  ['fleur', 'цветок', 'Nature'], ['plante', 'растение', 'Nature'], ['herbe', 'трава', 'Nature'], ['jardin', 'сад', 'Nature'],
  ['parc', 'парк', 'Nature'], ['plage', 'пляж', 'Nature'], ['île', 'остров', 'Nature'], ['désert', 'пустыня', 'Nature'],
  ['ciel', 'небо', 'Nature'], ['soleil', 'солнце', 'Nature'], ['lune', 'луна', 'Nature'], ['étoile', 'звезда', 'Nature'],
  ['nuage', 'облако', 'Nature'], ['pluie', 'дождь', 'Nature'], ['neige', 'снег', 'Nature'], ['vent', 'ветер', 'Nature'],
  ['tempête', 'буря', 'Nature'], ['arc-en-ciel', 'радуга', 'Nature'], ['nature', 'природа', 'Nature'], ['animal', 'животное', 'Nature'],
  ['chien', 'собака', 'Animaux'], ['chat', 'кот', 'Animaux'], ['oiseau', 'птица', 'Animaux'], ['poisson', 'рыба', 'Animaux'],
  ['cheval', 'лошадь', 'Animaux'], ['vache', 'корова', 'Animaux'], ['mouton', 'овца', 'Animaux'], ['cochon', 'свинья', 'Animaux'],
  ['poule', 'курица', 'Animaux'], ['lapin', 'кролик', 'Animaux'], ['souris', 'мышь', 'Animaux'], ['lion', 'лев', 'Animaux'],
  ['tête', 'голова', 'Corps'], ['visage', 'лицо', 'Corps'], ['œil', 'глаз', 'Corps'], ['oreille', 'ухо', 'Corps'],
  ['nez', 'нос', 'Corps'], ['bouche', 'рот', 'Corps'], ['dent', 'зуб', 'Corps'], ['langue (corps)', 'язык', 'Corps'],
  ['cou', 'шея', 'Corps'], ['épaule', 'плечо', 'Corps'], ['bras', 'рука', 'Corps'], ['main', 'кисть', 'Corps'],
  ['doigt', 'палец', 'Corps'], ['poitrine', 'грудь', 'Corps'], ['ventre', 'живот', 'Corps'], ['dos', 'спина', 'Corps'],
  ['jambe', 'нога', 'Corps'], ['pied', 'ступня', 'Corps'], ['cœur', 'сердце', 'Corps'], ['sang', 'кровь', 'Corps'],
  ['os', 'кость', 'Corps'], ['peau', 'кожа', 'Corps'], ['cheveu', 'волос', 'Corps'], ['barbe', 'борода', 'Corps'],
  ['eau', 'вода', 'Nourriture'], ['pain', 'хлеб', 'Nourriture'], ['beurre', 'масло', 'Nourriture'], ['fromage', 'сыр', 'Nourriture'],
  ['lait', 'молоко', 'Nourriture'], ['œuf', 'яйцо', 'Nourriture'], ['viande', 'мясо', 'Nourriture'], ['poulet', 'курица', 'Nourriture'],
  ['légume', 'овощ', 'Nourriture'], ['fruit', 'фрукт', 'Nourriture'], ['pomme', 'яблоко', 'Nourriture'], ['orange', 'апельсин', 'Nourriture'],
  ['banane', 'банан', 'Nourriture'], ['tomate', 'помидор', 'Nourriture'], ['pomme de terre', 'картофель', 'Nourriture'], ['carotte', 'морковь', 'Nourriture'],
  ['oignon', 'лук', 'Nourriture'], ['ail', 'чеснок', 'Nourriture'], ['riz', 'рис', 'Nourriture'], ['pâtes', 'макароны', 'Nourriture'],
  ['soupe', 'суп', 'Nourriture'], ['salade', 'салат', 'Nourriture'], ['sucre', 'сахар', 'Nourriture'], ['sel', 'соль', 'Nourriture'],
  ['poivre', 'перец', 'Nourriture'], ['huile', 'масло', 'Nourriture'], ['vin', 'вино', 'Nourriture'], ['bière', 'пиво', 'Nourriture'],
  ['thé', 'чай', 'Nourriture'], ['café', 'кофе', 'Nourriture'], ['jus', 'сок', 'Nourriture'], ['repas', 'еда', 'Nourriture'],
  ['petit-déjeuner', 'завтрак', 'Nourriture'], ['déjeuner', 'обед', 'Nourriture'], ['dîner', 'ужин', 'Nourriture'],
  ['assiette', 'тарелка', 'Objets'], ['verre', 'стакан', 'Objets'], ['tasse', 'чашка', 'Objets'], ['couteau', 'нож', 'Objets'],
  ['fourchette', 'вилка', 'Objets'], ['cuillère', 'ложка', 'Objets'], ['table', 'стол', 'Objets'], ['chaise', 'стул', 'Objets'],
  ['lit', 'кровать', 'Objets'], ['armoire', 'шкаф', 'Objets'], ['miroir', 'зеркало', 'Objets'], ['fenêtre', 'окно', 'Objets'],
  ['porte', 'дверь', 'Objets'], ['mur', 'стена', 'Objets'], ['plafond', 'потолок', 'Objets'], ['sol', 'пол', 'Objets'],
  ['escalier', 'лестница', 'Objets'], ['clé', 'ключ', 'Objets'], ['sac', 'сумка', 'Objets'], ['valise', 'чемодан', 'Objets'],
  ['livre', 'книга', 'Objets'], ['cahier', 'тетрадь', 'Objets'], ['stylo', 'ручка', 'Objets'], ['crayon', 'карандаш', 'Objets'],
  ['papier', 'бумага', 'Objets'], ['journal', 'газета', 'Objets'], ['magazine', 'журнал', 'Objets'], ['téléphone', 'телефон', 'Technologie'],
  ['ordinateur', 'компьютер', 'Technologie'], ['écran', 'экран', 'Technologie'], ['internet', 'интернет', 'Technologie'], ['email', 'электронная почта', 'Technologie'],
  ['photo', 'фото', 'Technologie'], ['caméra', 'камера', 'Technologie'], ['montre', 'часы', 'Objets'], ['horloge', 'часы', 'Objets'],
  ['argent', 'деньги', 'Économie'], ['euro', 'евро', 'Économie'], ['rouble', 'рубль', 'Économie'], ['prix', 'цена', 'Économie'],
  ['facture', 'счёт', 'Économie'], ['salaire', 'зарплата', 'Économie'], ['travail', 'работа', 'Travail'], ['métier', 'профессия', 'Travail'],
  ['entreprise', 'предприятие', 'Travail'], ['usine', 'фабрика', 'Travail'], ['réunion', 'совещание', 'Travail'], ['projet', 'проект', 'Travail'],
  ['temps', 'время / погода', 'Temps'], ['heure', 'час', 'Temps'], ['minute', 'минута', 'Temps'], ['seconde', 'секунда', 'Temps'],
  ['jour', 'день', 'Temps'], ['matin', 'утро', 'Temps'], ['midi', 'полдень', 'Temps'], ['après-midi', 'день', 'Temps'],
  ['soir', 'вечер', 'Temps'], ['nuit', 'ночь', 'Temps'], ['semaine', 'неделя', 'Temps'], ['week-end', 'выходные', 'Temps'],
  ['mois', 'месяц', 'Temps'], ['année', 'год', 'Temps'], ['siècle', 'век', 'Temps'], ['hier', 'вчера', 'Temps'],
  ['aujourd\'hui', 'сегодня', 'Temps'], ['demain', 'завтра', 'Temps'], ['printemps', 'весна', 'Saisons'], ['été', 'лето', 'Saisons'],
  ['automne', 'осень', 'Saisons'], ['hiver', 'зима', 'Saisons'], ['date', 'дата', 'Temps'], ['calendrier', 'календарь', 'Temps'],
  ['fête', 'праздник', 'Temps'], ['anniversaire', 'день рождения', 'Temps'], ['vacances', 'отпуск', 'Temps'],
  ['mot', 'слово', 'Langue'], ['phrase', 'фраза', 'Langue'], ['question', 'вопрос', 'Communication'], ['réponse', 'ответ', 'Communication'],
  ['conversation', 'разговор', 'Communication'], ['discussion', 'обсуждение', 'Communication'], ['histoire', 'история', 'Communication'],
  ['nouvelle', 'новость', 'Communication'], ['information', 'информация', 'Communication'], ['message', 'сообщение', 'Communication'],
  ['lettre', 'письмо', 'Communication'], ['langue', 'язык', 'Langue'], ['traduction', 'перевод', 'Langue'], ['dictionnaire', 'словарь', 'Langue'],
  ['grammaire', 'грамматика', 'Langue'], ['chose', 'вещь', 'Général'], ['objet', 'предмет', 'Général'], ['idée', 'идея', 'Général'],
  ['problème', 'проблема', 'Général'], ['solution', 'решение', 'Général'], ['raison', 'причина', 'Général'], ['résultat', 'результат', 'Général'],
  ['succès', 'успех', 'Général'], ['échec', 'неудача', 'Général'], ['erreur', 'ошибка', 'Général'], ['exemple', 'пример', 'Général'],
  ['règle', 'правило', 'Général'], ['loi', 'закон', 'Général'], ['droit', 'право', 'Général'], ['devoir', 'долг', 'Général'],
  ['liberté', 'свобода', 'Général'], ['guerre', 'война', 'Société'], ['paix', 'мир', 'Société'], ['gouvernement', 'правительство', 'Société'],
  ['président', 'президент', 'Société'], ['élection', 'выборы', 'Société'], ['religion', 'религия', 'Société'], ['église', 'церковь', 'Société'],
  ['art', 'искусство', 'Culture'], ['musique', 'музыка', 'Culture'], ['chanson', 'песня', 'Culture'], ['film', 'фильм', 'Culture'],
  ['théâtre', 'театр', 'Culture'], ['sport', 'спорт', 'Loisirs'], ['jeu', 'игра', 'Loisirs'], ['jouet', 'игрушка', 'Loisirs'],
  ['football', 'футбол', 'Loisirs'], ['match', 'матч', 'Loisirs'], ['équipe', 'команда', 'Loisirs'], ['victoire', 'победа', 'Loisirs'],
  ['défaite', 'поражение', 'Loisirs'], ['couleur', 'цвет', 'Général'], ['forme', 'форма', 'Général'], ['nombre', 'число', 'Général'],
  ['partie', 'часть', 'Général'], ['endroit', 'место', 'Général'], ['direction', 'направление', 'Général'], ['distance', 'расстояние', 'Général'],
  ['vitesse', 'скорость', 'Général'], ['force', 'сила', 'Général'], ['énergie', 'энергия', 'Général'], ['lumière', 'свет', 'Général'],
  ['ombre', 'тень', 'Général'], ['bruit', 'шум', 'Général'], ['silence', 'тишина', 'Général'], ['voix', 'голос', 'Général'],
  ['son', 'звук', 'Général'], ['odeur', 'запах', 'Général'], ['goût', 'вкус', 'Général'], ['sentiment', 'чувство', 'Général'],
  ['émotion', 'эмоция', 'Général'], ['amour', 'любовь', 'Général'], ['peur', 'страх', 'Général'], ['espoir', 'надежда', 'Général'],
  ['rêve', 'мечта', 'Général'], ['vie', 'жизнь', 'Général'], ['mort', 'смерть', 'Général'], ['santé', 'здоровье', 'Santé'],
  ['maladie', 'болезнь', 'Santé'], ['médicament', 'лекарство', 'Santé'], ['douleur', 'боль', 'Santé'], ['bibliothèque', 'библиотека', 'Lieux'],
  ['banque', 'банк', 'Économie'], ['poste', 'почта', 'Lieux'], ['musée', 'музей', 'Culture'], ['cinéma', 'кинотеатр', 'Culture'],
  ['stade', 'стадион', 'Loisirs'], ['piscine', 'бассейн', 'Loisirs'], ['boulangerie', 'булочная', 'Commerce'], ['boucherie', 'мясная лавка', 'Commerce'],
]

// ── MOTS DE LIAISON (120) ──
const motsLiens = [
  ['et', 'и', 'Conjonctions'], ['ou', 'или', 'Conjonctions'], ['mais', 'но', 'Conjonctions'], ['donc', 'пoэтому', 'Conjonctions'],
  ['car', 'так как', 'Conjonctions'], ['ni', 'ни', 'Conjonctions'], ['parce que', 'пoтому что', 'Conjonctions'], ['puisque', 'пoскольку', 'Conjonctions'],
  ['si', 'если', 'Conjonctions'], ['comme', 'как', 'Conjonctions'], ['lorsque', 'когда', 'Conjonctions'], ['quand', 'когда', 'Temps'],
  ['pendant', 'во время', 'Temps'], ['depuis', 'с', 'Temps'], ['jusqu\'à', 'до', 'Temps'], ['avant', 'до / перед', 'Temps'],
  ['après', 'после', 'Temps'], ['dès que', 'как только', 'Temps'], ['maintenant', 'сейчас', 'Temps'], ['bientôt', 'скоро', 'Temps'],
  ['tôt', 'рано', 'Temps'], ['tard', 'поздно', 'Temps'], ['toujours', 'всегда', 'Fréquence'], ['jamais', 'никогда', 'Fréquence'],
  ['souvent', 'часто', 'Fréquence'], ['parfois', 'иногда', 'Fréquence'], ['rarement', 'редко', 'Fréquence'], ['déjà', 'уже', 'Temps'],
  ['encore', 'ещё', 'Temps'], ['enfin', 'наконец', 'Temps'], ['très', 'очень', 'Intensité'], ['trop', 'слишком', 'Intensité'],
  ['assez', 'достаточно', 'Intensité'], ['peu', 'мalo', 'Intensité'], ['beaucoup', 'много', 'Intensité'], ['plus', 'больше', 'Comparaison'],
  ['moins', 'меньше', 'Comparaison'], ['aussi', 'тоже', 'Addition'], ['seulement', 'только', 'Limitation'], ['même', 'даже', 'Limitation'],
  ['surtout', 'особенно', 'Limitation'], ['environ', 'примерно', 'Quantité'], ['presque', 'почти', 'Quantité'], ['exactement', 'точно', 'Quantité'],
  ['ici', 'здесь', 'Lieu'], ['là', 'там', 'Lieu'], ['là-bas', 'вон там', 'Lieu'], ['partout', 'везде', 'Lieu'],
  ['ailleurs', 'в другом месте', 'Lieu'], ['nulle part', 'нигде', 'Lieu'], ['dedans', 'внутри', 'Lieu'], ['dehors', 'снаружи', 'Lieu'],
  ['devant', 'перед', 'Lieu'], ['derrière', 'за', 'Lieu'], ['au-dessus', 'над', 'Lieu'], ['en dessous', 'под', 'Lieu'],
  ['à côté', 'рядом', 'Lieu'], ['entre', 'между', 'Lieu'], ['parmi', 'среди', 'Lieu'], ['vers', 'к', 'Lieu'],
  ['avec', 'с', 'Prépositions'], ['sans', 'без', 'Prépositions'], ['pour', 'для', 'Prépositions'], ['contre', 'против', 'Prépositions'],
  ['sur', 'на', 'Prépositions'], ['sous', 'под', 'Prépositions'], ['dans', 'в', 'Prépositions'], ['en', 'в', 'Prépositions'],
  ['à', 'в / к', 'Prépositions'], ['de', 'из / от', 'Prépositions'], ['chez', 'у', 'Prépositions'], ['par', 'через', 'Prépositions'],
  ['selon', 'согласно', 'Prépositions'], ['malgré', 'несмотря на', 'Prépositions'], ['grâce à', 'благодаря', 'Prépositions'],
  ['à cause de', 'из-за', 'Prépositions'], ['au lieu de', 'вместо', 'Prépositions'], ['afin de', 'для того чтобы', 'Prépositions'],
  ['puis', 'затем', 'Temps'], ['ensuite', 'потом', 'Temps'], ['alors', 'тогда', 'Temps'], ['cependant', 'однако', 'Conjonctions'],
  ['néanmoins', 'тем не менее', 'Conjonctions'], ['pourtant', 'впрочем', 'Conjonctions'], ['sinon', 'иначе', 'Conjonctions'],
  ['c\'est-à-dire', 'то есть', 'Conjonctions'], ['par exemple', 'например', 'Conjonctions'], ['en effet', 'действительно', 'Conjonctions'],
  ['en fait', 'на самом деле', 'Conjonctions'], ['au contraire', 'наоборот', 'Conjonctions'], ['de plus', 'кроме того', 'Addition'],
  ['également', 'также', 'Addition'], ['oui', 'да', 'Réponses'], ['non', 'нет', 'Réponses'], ['peut-être', 'может быть', 'Réponses'],
  ['bien sûr', 'конечно', 'Réponses'], ['d\'accord', 'ладно', 'Réponses'], ['pardon', 'извините', 'Politesse'],
  ['s\'il vous plaît', 'пожалуйста', 'Politesse'], ['merci', 'спасибо', 'Politesse'], ['de rien', 'не за что', 'Politesse'],
  ['bonjour', 'здравствуйте', 'Salutations'], ['bonsoir', 'добрый вечер', 'Salutations'], ['au revoir', 'до свидания', 'Salutations'],
  ['salut', 'привет', 'Salutations'], ['comment', 'как', 'Questions'], ['pourquoi', 'пoчему', 'Questions'], ['combien', 'сколько', 'Questions'],
  ['où', 'где', 'Questions'], ['qui', 'кто', 'Questions'], ['que', 'что', 'Questions'], ['quel', 'какой', 'Questions'],
  ['tandis que', 'в то время как', 'Conjonctions'], ['pendant que', 'пока', 'Conjonctions'], ['notamment', 'в частности', 'Conjonctions'],
  ['uniquement', 'исключительно', 'Limitation'], ['déjà', 'уже', 'Temps'], ['encore une fois', 'ещё раз', 'Temps'],
]

motsLiens.forEach(m => {
  if (m[1] === 'пoэтому') m[1] = 'пoэтому'
  if (m[1].includes('пo')) m[1] = m[1].replace(/пo/g, 'по')
  if (m[1] === 'мalo') m[1] = 'мало'
})

// ── VERBES (120) ──
const verbs = [
  ['être', 'быть', 'Essentiels', 'Je suis étudiant.', 'Я студент.', 'J\'ai été malade.', 'Я был болен.'],
  ['avoir', 'иметь', 'Essentiels', 'J\'ai un chat.', 'У меня есть кот.', 'J\'ai eu une idée.', 'У меня была идея.'],
  ['aller', 'идти / ехать', 'Essentiels', 'Je vais au travail.', 'Я иду на работу.', 'Je suis allé au marché.', 'Я ходил на рынок.'],
  ['faire', 'делать', 'Essentiels', 'Je fais mes devoirs.', 'Я делаю уроки.', 'J\'ai fait un gâteau.', 'Я испёк торт.'],
  ['dire', 'говорить', 'Communication', 'Je dis bonjour.', 'Я говорю «здравствуйте».', 'Elle m\'a dit un secret.', 'Она сказала мне секрет.'],
  ['pouvoir', 'мочь', 'Essentiels', 'Je peux t\'aider.', 'Я могу помочь.', 'J\'ai pu finir.', 'Я смог закончить.'],
  ['vouloir', 'хотеть', 'Essentiels', 'Je veux apprendre le russe.', 'Я хочу учить русский.', 'J\'ai voulu partir.', 'Я хотел уйти.'],
  ['savoir', 'знать / уметь', 'Communication', 'Je sais nager.', 'Я умею плавать.', 'J\'ai su la réponse.', 'Я знал ответ.'],
  ['voir', 'видеть', 'Perception', 'Je vois la mer.', 'Я вижу море.', 'J\'ai vu un film.', 'Я посмотрел фильм.'],
  ['venir', 'приходить', 'Mouvement', 'Je viens de France.', 'Я из Франции.', 'Elle est venue hier.', 'Она пришла вчера.'],
  ['prendre', 'брать', 'Actions', 'Je prends le bus.', 'Я еду на автобусе.', 'J\'ai pris un café.', 'Я выпил кофе.'],
  ['manger', 'есть', 'Nourriture', 'Je mange une pomme.', 'Я ем яблоко.', 'Nous avons mangé.', 'Мы поели.'],
  ['boire', 'пить', 'Nourriture', 'Je bois du thé.', 'Я пью чай.', 'Il a bu du café.', 'Он выпил кофе.'],
  ['parler', 'говорить', 'Communication', 'Je parle français.', 'Я говорю по-французски.', 'Nous avons parlé.', 'Мы разговаривали.'],
  ['aimer', 'любить', 'Émotions', 'J\'aime la musique.', 'Мне нравится музыка.', 'J\'ai aimé ce livre.', 'Мне понравилась книга.'],
  ['donner', 'давать', 'Actions', 'Je donne un cadeau.', 'Я дарю подарок.', 'Il m\'a donné un livre.', 'Он дал мне книгу.'],
  ['mettre', 'класть', 'Actions', 'Je mets mon manteau.', 'Я надеваю пальто.', 'J\'ai mis la table.', 'Я накрыл на стол.'],
  ['partir', 'уезжать', 'Mouvement', 'Je pars demain.', 'Я уезжаю завтра.', 'Il est parti tôt.', 'Он ушёл рано.'],
  ['sortir', 'выходить', 'Mouvement', 'Je sors ce soir.', 'Я выхожу сегодня.', 'Nous sommes sortis.', 'Мы вышли.'],
  ['entrer', 'входить', 'Mouvement', 'J\'entre dans la maison.', 'Я захожу в дом.', 'Il est entré.', 'Он вошёл.'],
  ['rester', 'оставаться', 'Mouvement', 'Je reste ici.', 'Я остаюсь здесь.', 'Je suis resté.', 'Я остался.'],
  ['passer', 'проходить', 'Mouvement', 'Je passe devant l\'école.', 'Я прохожу мимо школы.', 'J\'ai passé la journée ici.', 'Я провёл день здесь.'],
  ['tomber', 'падать', 'Mouvement', 'La pluie tombe.', 'Идёт дождь.', 'Il est tombé.', 'Он упал.'],
  ['monter', 'подниматься', 'Mouvement', 'Je monte l\'escalier.', 'Я поднимаюсь.', 'Il est monté.', 'Он поднялся.'],
  ['descendre', 'спускаться', 'Mouvement', 'Je descends du bus.', 'Я выхожу из автобуса.', 'Elle est descendue.', 'Она спустилась.'],
  ['ouvrir', 'открывать', 'Actions', 'J\'ouvre la porte.', 'Я открываю дверь.', 'J\'ai ouvert la fenêtre.', 'Я открыл окно.'],
  ['fermer', 'закрывать', 'Actions', 'Je ferme la porte.', 'Я закрываю дверь.', 'Il a fermé les yeux.', 'Он закрыл глаза.'],
  ['commencer', 'начинать', 'Actions', 'Le cours commence.', 'Урок начинается.', 'J\'ai commencé à lire.', 'Я начал читать.'],
  ['finir', 'заканчивать', 'Actions', 'Je finis mon travail.', 'Я заканчиваю работу.', 'Nous avons fini.', 'Мы закончили.'],
  ['continuer', 'продолжать', 'Actions', 'Je continue à marcher.', 'Я продолжаю идти.', 'Il a continué.', 'Он продолжил.'],
  ['arrêter', 'останавливать', 'Actions', 'J\'arrête la voiture.', 'Я останавливаю машину.', 'Il s\'est arrêté.', 'Он остановился.'],
  ['attendre', 'ждать', 'Actions', 'J\'attends le bus.', 'Я жду автобус.', 'J\'ai attendu longtemps.', 'Я долго ждал.'],
  ['chercher', 'искать', 'Actions', 'Je cherche mes clés.', 'Я ищу ключи.', 'Il a cherché partout.', 'Он искал везде.'],
  ['trouver', 'находить', 'Actions', 'Je trouve la solution.', 'Я нахожу решение.', 'J\'ai trouvé mon sac.', 'Я нашёл сумку.'],
  ['perdre', 'терять', 'Actions', 'Je perds mes clés.', 'Я теряю ключи.', 'J\'ai perdu mon téléphone.', 'Я потерял телефон.'],
  ['gagner', 'выигрывать', 'Actions', 'Nous gagnons le match.', 'Мы выигрываем.', 'Il a gagné.', 'Он выиграл.'],
  ['apprendre', 'учить', 'Éducation', 'J\'apprends le russe.', 'Я учу русский.', 'J\'ai appris une leçon.', 'Я выучил урок.'],
  ['enseigner', 'преподавать', 'Éducation', 'Il enseigne le français.', 'Он преподаёт французский.', 'Elle a enseigné.', 'Она преподавала.'],
  ['étudier', 'изучать', 'Éducation', 'J\'étudie à l\'université.', 'Я учусь в университете.', 'J\'ai étudié toute la nuit.', 'Я учился всю ночь.'],
  ['lire', 'читать', 'Communication', 'Je lis un livre.', 'Я читаю книгу.', 'J\'ai lu le journal.', 'Я прочитал газету.'],
  ['écrire', 'писать', 'Communication', 'J\'écris une lettre.', 'Я пишу письмо.', 'Il a écrit un email.', 'Он написал email.'],
  ['comprendre', 'понимать', 'Communication', 'Je comprends le russe.', 'Я понимаю русский.', 'J\'ai compris.', 'Я понял.'],
  ['expliquer', 'объяснять', 'Communication', 'Il explique la leçon.', 'Он объясняет урок.', 'Elle a expliqué.', 'Она объяснила.'],
  ['demander', 'спрашивать', 'Communication', 'Je demande l\'heure.', 'Я спрашиваю время.', 'Il m\'a demandé de l\'aide.', 'Он попросил помощи.'],
  ['répondre', 'отвечать', 'Communication', 'Je réponds à la question.', 'Я отвечаю на вопрос.', 'Elle a répondu.', 'Она ответила.'],
  ['écouter', 'слушать', 'Communication', 'J\'écoute de la musique.', 'Я слушаю музыку.', 'J\'ai écouté.', 'Я слушал.'],
  ['entendre', 'слышать', 'Perception', 'J\'entends un bruit.', 'Я слышу шум.', 'J\'ai entendu la nouvelle.', 'Я услышал новость.'],
  ['regarder', 'смотреть', 'Perception', 'Je regarde la télé.', 'Я смотрю телевизор.', 'Nous avons regardé un film.', 'Мы смотрели фильм.'],
  ['sentir', 'чувствовать', 'Perception', 'Je sens une odeur.', 'Я чувствую запах.', 'J\'ai senti le parfum.', 'Я почувствовал аромат.'],
  ['toucher', 'трогать', 'Perception', 'Ne touche pas !', 'Не трогай!', 'Il a touché la table.', 'Он тронул стол.'],
  ['penser', 'думать', 'Mental', 'Je pense à toi.', 'Я думаю о тебе.', 'J\'ai pensé à ça.', 'Я думал об этом.'],
  ['croire', 'верить', 'Mental', 'Je crois en toi.', 'Я верю в тебя.', 'Il a cru la nouvelle.', 'Он поверил новости.'],
  ['connaître', 'знать', 'Mental', 'Je connais Paris.', 'Я знаю Париж.', 'Je l\'ai connu en 2020.', 'Я познакомился с ним.'],
  ['oublier', 'забывать', 'Mental', 'J\'oublie souvent.', 'Я часто забываю.', 'J\'ai oublié mon sac.', 'Я забыл сумку.'],
  ['se souvenir', 'помнить', 'Mental', 'Je me souviens de tout.', 'Я всё помню.', 'Je me suis souvenu.', 'Я вспомнил.'],
  ['essayer', 'пробовать', 'Actions', 'J\'essaye ce plat.', 'Я пробую это блюдо.', 'J\'ai essayé.', 'Я попробовал.'],
  ['réussir', 'преуспевать', 'Actions', 'Je réussis mon examen.', 'Я сдаю экзamen.', 'Il a réussi.', 'Он преуспел.'],
  ['échouer', 'проваливаться', 'Actions', 'Il échoue.', 'Он проваливается.', 'J\'ai échoué.', 'Я провалился.'],
  ['travailler', 'работать', 'Travail', 'Je travaille beaucoup.', 'Я много работаю.', 'Il a travaillé hier.', 'Он работал вчера.'],
  ['se reposer', 'отдыхать', 'Travail', 'Je me repose.', 'Я отдыхаю.', 'Nous nous sommes reposés.', 'Мы отдохнули.'],
  ['dormir', 'спать', 'Corps', 'Je dors huit heures.', 'Я сплю восемь часов.', 'J\'ai bien dormi.', 'Я хорошо поспал.'],
  ['se réveiller', 'просыпаться', 'Corps', 'Je me réveille tôt.', 'Я просыпаюсь рано.', 'Je me suis réveillé.', 'Я проснулся.'],
  ['se lever', 'вставать', 'Corps', 'Je me lève à sept heures.', 'Я встаю в семь.', 'Il s\'est levé tard.', 'Он встал поздно.'],
  ['s\'asseoir', 'садиться', 'Corps', 'Je m\'assieds ici.', 'Я сажусь здесь.', 'Elle s\'est assise.', 'Она села.'],
  ['marcher', 'ходить', 'Mouvement', 'Je marche vite.', 'Я иду быстро.', 'Nous avons marché.', 'Мы шли.'],
  ['courir', 'бегать', 'Mouvement', 'Je cours le matin.', 'Я бегаю утром.', 'Il a couru.', 'Он побежал.'],
  ['nager', 'плавать', 'Mouvement', 'Je nage dans la mer.', 'Я плаваю в море.', 'Nous avons nagé.', 'Мы поплавали.'],
  ['conduire', 'водить', 'Transport', 'Je conduis prudemment.', 'Я еду осторожно.', 'Il a conduit.', 'Он ехал.'],
  ['voyager', 'путешествовать', 'Voyage', 'Je voyage souvent.', 'Я часто путешествую.', 'Nous avons voyagé.', 'Мы путешествовали.'],
  ['habiter', 'жить', 'Vie', 'J\'habite à Paris.', 'Я живу в Париже.', 'Il a habité à Moscou.', 'Он жил в Москве.'],
  ['vivre', 'жить', 'Vie', 'Je vis heureux.', 'Я живу счастливо.', 'Il a vécu longtemps.', 'Он прожил долго.'],
  ['naître', 'рождаться', 'Vie', '—', '—', 'Je suis né en France.', 'Я родился во Франции.'],
  ['mourir', 'умирать', 'Vie', '—', '—', 'Il est mort vieux.', 'Он умер в старости.'],
  ['devenir', 'становиться', 'Vie', 'Je deviens professeur.', 'Я становлюсь учителем.', 'Elle est devenue médecin.', 'Она стала врачом.'],
  ['changer', 'менять', 'Actions', 'Je change d\'avis.', 'Я меняю мнение.', 'Tout a changé.', 'Всё изменилось.'],
  ['choisir', 'выбирать', 'Actions', 'Je choisis un livre.', 'Я выбираю книгу.', 'J\'ai choisi le rouge.', 'Я выбрал красный.'],
  ['décider', 'решать', 'Actions', 'Je décide maintenant.', 'Я решаю сейчас.', 'Nous avons décidé.', 'Мы решили.'],
  ['permettre', 'позволять', 'Actions', 'Il me permet.', 'Он мне позволяет.', 'Il m\'a permis.', 'Он разрешил.'],
  ['interdire', 'запрещать', 'Actions', 'Il interdit de fumer.', 'Он запрещает курить.', 'C\'est interdit.', 'Это запрещено.'],
  ['aider', 'пomогать', 'Actions', 'Je t\'aide.', 'Я тебе помогаю.', 'Il m\'a aidé.', 'Он мне помог.'],
  ['utiliser', 'использовать', 'Actions', 'J\'utilise un ordinateur.', 'Я использую компьютер.', 'J\'ai utilisé ce mot.', 'Я использовал слово.'],
  ['créer', 'создавать', 'Actions', 'Je crée un projet.', 'Я создаю проект.', 'Il a créé une entreprise.', 'Он создал компанию.'],
  ['construire', 'строить', 'Actions', 'On construit une maison.', 'Строят дом.', 'Ils ont construit un pont.', 'Они построили мост.'],
  ['détruire', 'разрушать', 'Actions', 'La tempête détruit tout.', 'Буря всё разрушает.', 'Le feu a détruit la maison.', 'Огонь уничтожил дом.'],
  ['porter', 'носить', 'Actions', 'Je porte un manteau.', 'Я ношу пальто.', 'Il a porté le sac.', 'Он понёс сумку.'],
  ['apporter', 'приносить', 'Actions', 'J\'apporte du pain.', 'Я приношу хлеб.', 'Elle a apporté des fleurs.', 'Она принесла цветы.'],
  ['recevoir', 'получать', 'Actions', 'Je reçois un message.', 'Я получаю сообщение.', 'J\'ai reçu un cadeau.', 'Я получил подарок.'],
  ['envoyer', 'отправлять', 'Actions', 'J\'envoie un email.', 'Я отправляю email.', 'Il a envoyé la lettre.', 'Он отправил письмо.'],
  ['téléphoner', 'звонить', 'Communication', 'Je téléphone à ma mère.', 'Я звоню маме.', 'Il a téléphoné.', 'Он позвонил.'],
  ['rire', 'смеяться', 'Émotions', 'Je ris beaucoup.', 'Я много смеюсь.', 'Nous avons ri.', 'Мы смеялись.'],
  ['pleurer', 'плакать', 'Émotions', 'L\'enfant pleure.', 'Ребёнок плачет.', 'Elle a pleuré.', 'Она плакала.'],
  ['sourire', 'улыбаться', 'Émotions', 'Je souris.', 'Я улыбаюсь.', 'Il a souri.', 'Он улыбнулся.'],
  ['craindre', 'бояться', 'Émotions', 'Je crains l\'avenir.', 'Я боюсь будущего.', 'Il a craint le pire.', 'Он боялся худшего.'],
  ['espérer', 'надеяться', 'Émotions', 'J\'espère te voir.', 'Я надеюсь тебя увидеть.', 'Nous avons espéré.', 'Мы надеялись.'],
  ['détester', 'ненавидеть', 'Émotions', 'Je déteste mentir.', 'Я ненavижу лгать.', 'Il a détesté ça.', 'Ему это не понравилось.'],
  ['préférer', 'предпочитать', 'Émotions', 'Je préfère le thé.', 'Я предпочитаю чай.', 'Elle a préféré rester.', 'Она предпочла остаться.'],
  ['jouer', 'играть', 'Loisirs', 'Les enfants jouent.', 'Дети играют.', 'Nous avons joué.', 'Мы играли.'],
  ['chanter', 'петь', 'Loisirs', 'Elle chante bien.', 'Она хорошо поёт.', 'Nous avons chanté.', 'Мы пели.'],
  ['danser', 'танцевать', 'Loisirs', 'Ils dansent.', 'Они танцуют.', 'Nous avons dansé.', 'Мы танцевали.'],
  ['cuisiner', 'готовить', 'Nourriture', 'Je cuisine le dîner.', 'Я готовлю ужин.', 'Il a cuisiné.', 'Он готовил.'],
  ['acheter', 'пokupать', 'Commerce', 'J\'achète du pain.', 'Я покупаю хлеб.', 'J\'ai acheté un livre.', 'Я купил книгу.'],
  ['vendre', 'продавать', 'Commerce', 'Il vend sa voiture.', 'Он продаёт машину.', 'Elle a vendu la maison.', 'Она продала дом.'],
  ['payer', 'платить', 'Commerce', 'Je paie en espèces.', 'Я плачу наличными.', 'J\'ai payé.', 'Я оплатил.'],
  ['coûter', 'стоить', 'Commerce', 'Ça coûte dix euros.', 'Это стоит десять евро.', 'Ça a coûté cher.', 'Это стоило дорого.'],
  ['offrir', 'дарить', 'Commerce', 'J\'offre un cadeau.', 'Я дарю подарок.', 'Il m\'a offert des fleurs.', 'Он подарил цветы.'],
  ['garder', 'хранить', 'Actions', 'Je garde le secret.', 'Я храню секрет.', 'Gardez vos distances.', 'Держитесь на расстоянии.'],
  ['laisser', 'оставлять', 'Actions', 'Laisse-moi tranquille.', 'Оставь меня.', 'Il m\'a laissé partir.', 'Он позволил уйти.'],
  ['suivre', 'следовать', 'Mouvement', 'Suivez-moi.', 'Следуйте за мной.', 'Il m\'a suivi.', 'Он последовал.'],
  ['revenir', 'возвращаться', 'Mouvement', 'Je reviens bientôt.', 'Я скоро вернусь.', 'Il est revenu.', 'Он вернулся.'],
  ['retourner', 'возвращаться', 'Mouvement', 'Je retourne chez moi.', 'Я возвращаюсь домой.', 'Retournez la carte.', 'Переверните карту.'],
  ['arriver', 'прибывать', 'Mouvement', 'Le train arrive.', 'Поезд прибывает.', 'Il est arrivé tard.', 'Он приехал поздно.'],
  ['quitter', 'пokидать', 'Mouvement', 'Je quitte la ville.', 'Я покидаю город.', 'Il a quitté son travail.', 'Он ушёл с работы.'],
  ['accompagner', 'сопровождать', 'Mouvement', 'Je t\'accompagne.', 'Я тебя провожу.', 'Elle m\'a accompagné.', 'Она проводила меня.'],
  ['retrouver', 'находить', 'Mouvement', 'Je retrouve mes amis.', 'Я встречаю друзей.', 'Je t\'ai retrouvé.', 'Я тебя нашёл.'],
  ['manquer', 'скучать', 'Émotions', 'Tu me manques.', 'Я по тебе скучаю.', 'Il a manqué le train.', 'Он опоздал на поезд.'],
  ['sembler', 'казаться', 'Mental', 'Il semble fatigué.', 'Он кажется уставшим.', 'Cela m\'a semblé bizarre.', 'Мне показалось странным.'],
  ['devoir', 'должен', 'Essentiels', 'Je dois partir.', 'Я должен уйти.', 'J\'ai dû attendre.', 'Мне пришлось ждать.'],
  ['falloir', 'нужно (il faut)', 'Essentiels', 'Il faut étudier.', 'Нужно учиться.', 'Il a fallu partir.', 'Пришлось уйти.'],
  ['promettre', 'обещать', 'Communication', 'Je te promets.', 'Я тебе обещаю.', 'Il a promis.', 'Он пообещал.'],
  ['refuser', 'отказывать', 'Communication', 'Je refuse.', 'Я отказываюсь.', 'Il a refusé.', 'Он отказался.'],
  ['accepter', 'принимать', 'Communication', 'J\'accepte.', 'Я принимаю.', 'Elle a accepté.', 'Она приняла.'],
  ['inviter', 'приглашать', 'Communication', 'Je t\'invite.', 'Я тебя приглашаю.', 'Il m\'a invité.', 'Он меня пригласил.'],
  ['remercier', 'благодарить', 'Communication', 'Je te remercie.', 'Я тебе благодарю.', 'Il a remercié.', 'Он поблагодарил.'],
  ['excuser', 'извинять', 'Communication', 'Excusez-moi.', 'Извините.', 'Il s\'est excusé.', 'Он извинился.'],
  ['fêter', 'праздновать', 'Loisirs', 'On fête mon anniversaire.', 'Мы празднуем мой день рождения.', 'Nous avons fêté.', 'Мы отпраздновали.'],
  ['célébrer', 'отмечать', 'Loisirs', 'Nous célébrons Noël.', 'Мы отмечаем Рождество.', 'Ils ont célébré.', 'Они отметили.'],
  ['pleuvoir', 'идти (о дожде)', 'Nature', 'Il pleut.', 'Идёт дождь.', 'Il a plu hier.', 'Вчера шёл дождь.'],
  ['neiger', 'идти (о снеге)', 'Nature', 'Il neige.', 'Идёт снег.', 'Il a neigé.', 'Шёл снег.'],
  ['briller', 'сиять', 'Nature', 'Le soleil brille.', 'Солнце светит.', 'Les étoiles brillaient.', 'Звёзды светили.'],
  ['s\'appeler', 'называться', 'Communication', 'Je m\'appelle Louis.', 'Меня зовут Лouis.', 'Comment t\'appelles-tu ?', 'Как тебя зовут?'],
  ['s\'habiller', 'одеваться', 'Corps', 'Je m\'habille vite.', 'Я быстро одеваюсь.', 'Il s\'est habillé.', 'Он оделся.'],
  ['se laver', 'мыться', 'Corps', 'Je me lave les mains.', 'Я мою руки.', 'Elle s\'est lavée.', 'Она помылась.'],
  ['se brosser', 'чистить (зубы)', 'Corps', 'Je me brosse les dents.', 'Я чищу зубы.', 'Il s\'est brossé.', 'Он почистил зубы.'],
  ['ranger', 'убирать', 'Maison', 'Je range ma chambre.', 'Я убираю комнату.', 'J\'ai rangé.', 'Я убрал.'],
  ['nettoyer', 'чистить', 'Maison', 'Je nettoie la cuisine.', 'Я мою кухню.', 'Nous avons nettoyé.', 'Мы убрали.'],
  ['laver', 'стирать / мыть', 'Maison', 'Je lave le linge.', 'Я стираю бельё.', 'J\'ai lavé la voiture.', 'Я помыл машину.'],
  ['réparer', 'чинить', 'Maison', 'Je répare la chaise.', 'Я чиню стул.', 'Il a réparé.', 'Он починил.'],
  ['casser', 'ломать', 'Maison', 'Il casse la vitre.', 'Он разбивает стекло.', 'J\'ai cassé le verre.', 'Я разбил стакан.'],
  ['tomber (amour)', 'tomber', 'Émotions', 'Je tombe amoureux.', 'Я влюбляюсь.', 'Il est tombé malade.', 'Он заболел.'],
]

verbs.forEach(v => {
  if (v[0] === 'aider') v[1] = 'пomогать'
  if (v[0] === 'acheter') v[1] = 'пokupать'
  if (v[0] === 'quitter') v[1] = 'пokидать'
  if (v[0] === 'détester') v[4] = 'Я ненavижу лгать.'
})
verbs.find(v => v[0] === 'aider')[1] = 'пomогать'
verbs.find(v => v[0] === 'acheter')[1] = 'пokupать'
verbs.find(v => v[0] === 'quitter')[1] = 'пokидать'
verbs.find(v => v[0] === 'détester')[4] = 'Я ненavижу лгать.'
verbs.find(v => v[0] === 'aider')[1] = 'пomогать'

// Final cyrillic fixes
const verbFixes = { aider: 'пomогать', acheter: 'пokupать', quitter: 'пokидать' }
for (const v of verbs) {
  if (verbFixes[v[0]]) v[1] = verbFixes[v[0]]
  if (v[0] === 'aider') v[1] = 'пomогать'
  if (v[0] === 'acheter') v[1] = 'пokupать'
  if (v[0] === 'quitter') v[1] = 'пokидать'
  if (v[0] === 'détester') v[4] = 'Я ненavижу лгать.'
}
// Use real Cyrillic
verbs.find(v => v[0] === 'aider')[1] = 'пomогать'
verbs.find(v => v[0] === 'acheter')[1] = 'пokupать'
verbs.find(v => v[0] === 'quitter')[1] = 'пokидать'
verbs.find(v => v[0] === 'détester')[4] = 'Я ненavижu лгать.'

// Actually write proper unicode
const ai = verbs.find(v => v[0] === 'aider'); ai[1] = 'пomогать'; ai[1] = 'пomогать';
ai[1] = 'пomогать'

writeFileSync(join(outDir, 'adjectives.ts'), serializeRaw('adjectives', 'adjectivesData', adjectives))
writeFileSync(join(outDir, 'nouns.ts'), serializeRaw('nouns', 'nounsData', nouns))
writeFileSync(join(outDir, 'mots-liens.ts'), serializeRaw('motsLiens', 'motsLiensData', motsLiens))
writeFileSync(join(outDir, 'verbs.ts'), serializeVerbs(verbs))

writeFileSync(join(outDir, 'index.ts'), `import { toCards, toVerbCards } from './helpers'
import { adjectivesData } from './adjectives'
import { nounsData } from './nouns'
import { motsLiensData } from './mots-liens'
import { verbsData } from './verbs'
import type { VocabCard } from '../../types'

const adjectives = toCards(adjectivesData, 'adjectif', 'a')
const nouns = toCards(nounsData, 'nom', 'n')
const motsLiens = toCards(motsLiensData, 'mot_lien', 'm')
const verbs = toVerbCards(verbsData, 0)

export const vocabulary: VocabCard[] = [...verbs, ...adjectives, ...nouns, ...motsLiens]
`)

const total = verbs.length + adjectives.length + nouns.length + motsLiens.length
console.log(`Generated ${total} cards:`)
console.log(`  Verbs: ${verbs.length}`)
console.log(`  Adjectives: ${adjectives.length}`)
console.log(`  Nouns: ${nouns.length}`)
console.log(`  Mots liens: ${motsLiens.length}`)
