export interface AlphabetLetter {
  upper: string
  lower: string
  /** Symbole API (Alphabet phonétique international) */
  ipa: string
  /** Texte lu par la synthèse vocale russe */
  speak: string
}

export const CYRILLIC_ALPHABET: AlphabetLetter[] = [
  { upper: 'А', lower: 'а', ipa: 'a', speak: 'а' },
  { upper: 'Б', lower: 'б', ipa: 'b', speak: 'б' },
  { upper: 'В', lower: 'в', ipa: 'v', speak: 'в' },
  { upper: 'Г', lower: 'г', ipa: 'ɡ', speak: 'г' },
  { upper: 'Д', lower: 'д', ipa: 'd', speak: 'д' },
  { upper: 'Е', lower: 'е', ipa: 'je', speak: 'е' },
  { upper: 'Ё', lower: 'ё', ipa: 'jo', speak: 'ё' },
  { upper: 'Ж', lower: 'ж', ipa: 'ʐ', speak: 'ж' },
  { upper: 'З', lower: 'з', ipa: 'z', speak: 'з' },
  { upper: 'И', lower: 'и', ipa: 'i', speak: 'и' },
  { upper: 'Й', lower: 'й', ipa: 'j', speak: 'й' },
  { upper: 'К', lower: 'к', ipa: 'k', speak: 'к' },
  { upper: 'Л', lower: 'л', ipa: 'l', speak: 'л' },
  { upper: 'М', lower: 'м', ipa: 'm', speak: 'м' },
  { upper: 'Н', lower: 'н', ipa: 'n', speak: 'н' },
  { upper: 'О', lower: 'о', ipa: 'o', speak: 'о' },
  { upper: 'П', lower: 'п', ipa: 'p', speak: 'п' },
  { upper: 'Р', lower: 'р', ipa: 'r', speak: 'р' },
  { upper: 'С', lower: 'с', ipa: 's', speak: 'с' },
  { upper: 'Т', lower: 'т', ipa: 't', speak: 'т' },
  { upper: 'У', lower: 'у', ipa: 'u', speak: 'у' },
  { upper: 'Ф', lower: 'ф', ipa: 'f', speak: 'ф' },
  { upper: 'Х', lower: 'х', ipa: 'x', speak: 'х' },
  { upper: 'Ц', lower: 'ц', ipa: 'ts', speak: 'ц' },
  { upper: 'Ч', lower: 'ч', ipa: 'tɕ', speak: 'ч' },
  { upper: 'Ш', lower: 'ш', ipa: 'ʂ', speak: 'ш' },
  { upper: 'Щ', lower: 'щ', ipa: 'ɕː', speak: 'щ' },
  { upper: 'Ъ', lower: 'ъ', ipa: '∅', speak: 'ъ' },
  { upper: 'Ы', lower: 'ы', ipa: 'ɨ', speak: 'ы' },
  { upper: 'Ь', lower: 'ь', ipa: 'ʲ', speak: 'ь' },
  { upper: 'Э', lower: 'э', ipa: 'e', speak: 'э' },
  { upper: 'Ю', lower: 'ю', ipa: 'ju', speak: 'ю' },
  { upper: 'Я', lower: 'я', ipa: 'ja', speak: 'я' },
]
