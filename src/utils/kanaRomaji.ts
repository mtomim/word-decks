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
    f: [..."ふ"],
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
  } as {[key:string]: string}
};

export function toRomaji(kana: string): string {
  return [...kana].map((ji) =>
  ({
    consonant: Object.entries(map.consonant)
      .filter(([, v]) => v.includes(ji))
      .map(([k,]) => k).join(),
    vowel: Object.entries(map.vowel)
      .filter(([, v]) => v.includes(ji))
      .map(([k,]) => k).join()
  } as { consonant: string, vowel: string }))
    .reduce((prev, { consonant, vowel }, i, arr) => {
      const next = arr[i + 1];
      const previous = prev[i - 1];
      if ((vowel === '-' && previous && previous.vowel)
        || (vowel === previous?.vowel && !consonant)
        || (vowel === 'u' && !consonant && previous?.vowel === 'o')
        ) {
        previous.vowel = map.longVowel[previous.vowel||''];
        vowel = '';
      }
      if (consonant === "supPre") {
        consonant = "";
        if (previous.consonant === "f") {
          delete previous.vowel;
        }
      }
      if (consonant === "ySupPre") {
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
      }
      if (consonant === "repeatNextConsonant") {
        consonant = next?.consonant.charAt(0) || "";
        if (next?.consonant === "ch") {
          consonant = "t";
        }
      }
      if (consonant === "n" && !vowel) {
        if (next && !next.consonant) {
          consonant = "n-";
        }
        if (next && [..."bpm"].includes(next.consonant.charAt(0))) {
          consonant = "m";
        }
      }
      prev.push({ consonant: consonant, vowel: vowel });
      return prev;
    }, [] as { consonant: string, vowel?: string }[])
    .map(({ consonant, vowel }) => consonant + (vowel || ""))
    .join("");
}