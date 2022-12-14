const Ascii = "A-Za-z0-9";
const Hiragana = "\u3040-\u309F";
const Katakana = "\u30A0-\u30FF";
const Kanji = "\u4E00-\u9FFF";
const ZenkakuNumAndHankakuKatakana = "\uFF01-\uFF9F";

export const CharacterRegExpValue = `${Ascii}${Hiragana}${Katakana}${Kanji}${ZenkakuNumAndHankakuKatakana}`;
