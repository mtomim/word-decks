import { toRomaji } from "@/utils/kanaRomaji";

describe('kanaRomaji.ts', () => {
    test.each([
        ['ちちゅうかい', 'chichūkai'],
        ['しんぶんし', 'shimbunshi'],
        ['いっぱんじん', 'ippanjin'],
        ['しょうがくせい', 'shōgakusei'],
        ['おぅ', 'ou'],
        ['おっ', 'o'],
        ['かちょう', 'kachō'],
        ['ひょう', 'hyō'],
        ['みょう', 'myō'],
        ['ぎょう', 'gyō'],
        ['じょう', 'jō'],
        ['ょゅぅ', 'yoyuu'],
        ['ひょうご', 'hyōgo'],
        ['ひゅーご', 'hyūgo'],
        ['ふぃーちゅあー', 'fīchuā'],
        ['ふゅーちゃー', 'fyūchā'],
        ['みふぁそ', 'mifaso'],
        ['ふらんすご', 'furansugo'],
        ['ふぁみりー', 'famirī'],
        ['ふらの', 'furano'],
        ['ふりょう', 'furyō'],
        ['おんおふすいっち', 'on-ofusuitchi'],
        ['こんにゃく', 'konnyaku'],
        ['あんま', 'amma'],
        ['おかあさん', 'okāsan'],
        ['きーきー', 'kīkī'],
        ['けーき', 'kēki'],
        ['とおり', 'tōri'],
        ['きいはんとう', 'kīhantō'],
    ])('translates %s to %s', (input, expected) => {
        expect(toRomaji(input)).toBe(expected);
    })
})