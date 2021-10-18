const map = {
  consonant: {
    k: [..."かきくけこ"],
    s: [..."さすせそ"],
    sh: ["し",],
    t: [..."たてと"],
    ts: ["つ",],
    ch: ["ち",],
    n: [..."なにぬねのん"],
    h: [..."はひへほ"],
    m: [..."まみむめも"],
    y: [..."やゆよ"],
    ySupPre: [..."ゃゅょ"],
    supPre: [..."ぁぃぅぇぉ"],
    r: [..."らりるれろ"],
    w: [..."わを",],
    f: ["ふ"],
    p: [..."ぱぴぷぺぽ"],
    b: [..."ばびぶべぼ"],
    j: [..."じぢ"],
    z: [..."ざずぜぞ"],
    d: [..."だでど"],
    g: [..."がぎぐげご"],
    repeatNextConsonant: ["っ"]
  },
  vowel: {
    a: [..."あかがさざただなはばぱまやらわぁゃ"],
    i: [..."いきぎしじちぢにひびぴみりぃ"],
    u: [..."うくぐすずつづぬふぶぷむゆるぅゅ"],
    e: [..."えけげせぜてでねへべぺめれぇ"],
    o: [..."おこごそぞとどのほぼぽもよろをょぉ"],
    "-": ["ー"]
  },
  longVowel: {
    a: 'ā',
    i: 'ī',
    u: 'ū',
    e: 'ē',
    o: 'ō',
  } as { [key: string]: string }
};

declare interface tempObj {
  consonant: string,
  vowel?: string,
  katakana: boolean,
}

const [lowerKatakana, upperKatakana] = [0x30A1, 0x30FB];

function isKatakana(ji: string): boolean {
  const code = ji.codePointAt(0);
  return code! >= lowerKatakana && code! < upperKatakana;
}

const noHiraganaCorrespondant = 'ヷヸヹヺ・ーヿ';

function convHiragana(ji: string): string {
  if (isKatakana(ji) && !noHiraganaCorrespondant.includes(ji)) {
    return String.fromCharCode(ji.codePointAt(0)! - 0x60);
  }
  return ji;
}

/**
 * Hiragana is transformed into lower case output.
 * Katakana is transformed into UPPER case output.
 * ```js
 * assert(toRomaji('ローマじ') === 'RŌMAji');
 * ```
 * The sequences of same vowels and 'ou' output with prolonged vowel of the first.
 * The sequence of 'ei' is not represented with long 'e'.
 * ex)
 * - 'ちちゅうかい', 'chichūkai'
 * - 'ふりょう', 'furyō'
 * - 'しょうがくせい', 'shōgakusei'
 * 
 * Caveat: The rule to not consider as prolonged vowel sound
 * the consecutive vowels are from separate Kanjis is not respected.
 * 
 * ex) 'きいはんとうのばあい'
 * - OK: 'kiihantōnobaai'
 * - Our _wrong_ output: 'kīhantōnobāi'
 * @param kana The input with Hiragana/Katakana
 * @returns Romaji representation of the input
 */
export function toRomaji(kana: string): string {
  return [...kana]
    .map((ji) => ({
      katakana: isKatakana(ji),
      ji: convHiragana(ji),
    }))
    .map(({ ji, katakana }) =>
    ({
      consonant: Object.entries(map.consonant)
        .filter(([, v]) => v.includes(ji))
        .map(([k,]) => k).join(),
      vowel: Object.entries(map.vowel)
        .filter(([, v]) => v.includes(ji))
        .map(([k,]) => k).join(),
      katakana
    } as tempObj))
    .reduce((prev, { consonant, vowel, katakana }, i, arr) => {
      const next = arr[i + 1];
      const previous = prev[i - 1];
      if ((vowel === '-' && previous && previous.vowel)
        || (vowel === previous?.vowel && !consonant)
        || (vowel === 'u' && !consonant && previous?.vowel === 'o')
      ) {
        previous.vowel = map.longVowel[previous.vowel || ''];
        vowel = undefined;
      } else if (consonant === "supPre") {
        consonant = "";
        if (previous.consonant === "f") {
          delete previous.vowel;
        }
      } else if (consonant === "ySupPre") {
        consonant = "y";
        if (previous) {
          if (["i", "e"].includes(previous.vowel || "")
            || previous.consonant === "f" && previous.vowel === "u") {
            delete previous.vowel;
          }
          if (["sh", "ch", "j"].includes(previous.consonant)) {
            consonant = "";
          }
        }
      } else if (consonant === "repeatNextConsonant") {
        consonant = next?.consonant.charAt(0) || "";
        if (next?.consonant === "ch") {
          consonant = "t";
        }
      } else if (consonant === "n" && !vowel) {
        if (next && !next.consonant) {
          consonant = "n-";
        }
        if (next && [..."bpm"].includes(next.consonant.charAt(0))) {
          consonant = "m";
        }
      }
      prev.push({ consonant: consonant, vowel: vowel, katakana });
      return prev;
    }, [] as tempObj[])
    .map(({ consonant, vowel, katakana }) => {
      if (katakana) {
        return (consonant + (vowel || "")).toUpperCase();
      }
      return consonant + (vowel || "");
    })
    .join("");
}