export default {
    en: {
        welcome: 'Welcome to WordDeck',
        lang: "English",
        info: 'For help and collaboration with a Japanese speaker, please join our online',
        discordChannel: 'Discord channel',
        label: {
            difficulty: 'Difficulty',
            numWords: 'Words',
            word: {
                word: 'Word',
                part: 'Part of speech',
                definition: 'Meaning',
                reading: 'Pronunciation'
            },
            start: 'Start',
            name: 'Name',
            words: 'Words',
            explain: 'Show explanation of words',
            acceptedformat: 'CSV or JSON with \'word\', \'reading\', \'definition\', \'part\'.',
            example: "Example:",
        },
        error: {
            headersmissing: "The fields ({headers}) present in '{filename}' doesn't include every expected field.",
            filetype: "Only CSV or JSON files with fields 'word', 'reading', 'definition', 'part' are accepted."
        },
    },
    fr: {
        welcome: 'Bienvenue à WordDeck',
        lang: "français",
        info: 'Pour avoir de l\'aide auprès d\'un Japonais, rejoignez-vous à notre',
        discordChannel: 'chaîne Discord',
        label: {
            difficulty: 'Difficulté',
            numWords: 'Nombre de mots',
            word: {
                word: 'Mot',
                part: 'Cat.gram.',
                definition: 'Sens',
                reading: 'Prononciation'
            },
            start: 'Démarrer',
            name: 'Nom',
            words: 'Mots',
            explain: 'Montrer l\'explication des mots',
            acceptedformat: 'CSV ou JSON avec \'word\', \'reading\', \'definition\', \'part\'.',
            example: "Exemple :",
        },
        error: {
            headersmissing: "Les champs ({headers}) présents dans '{filename}' n'incluent pas tous les champs requis.",
            filetype: "Seuls les fichiers CSV ou JSON ayant les champs 'word', 'reading', 'definition' et 'part' sont acceptés."
        },
    },
    ja: {
        welcome: 'WordDeck へようこそ',
        lang: "日本語",
        info: '日本語（にほんご）の質問（しつもん）等（とう、など）は、以下（いか）の方法（ほうほう）でどうぞ:',
        discordChannel: 'Discord チャンネル',
        label: {
            difficulty: '難易度（なんいど）',
            numWords: '単語（たんご）数（すう）',
            word: {
                word: '単語（たんご）',
                part: '品詞（ひんし）',
                definition: '意味（いみ）',
                reading: '読（よ）み'
            },
            start: 'スタート',
            name: '名前（なまえ）',
            words: '単語（たんご）リスト',
            explain: '単語（たんご）の説明（せつめい）を表示（ひょうじ）',
            acceptedformat: 'CSV または JSON で、 \'word\', \'reading\', \'definition\', \'part\' を含（ふく）むもの。',
            example: "例（れい）：",
      },
      error: {
          headersmissing: "ファイル '{filename}' 中（ちゅう）に見（み）つかったフィールド ({headers}) は必要（ひつよう）なフィールドをすべて含（ふく）んでません。",
          filetype: "以下（いか）のフィールドを含（ふく）んだ CSV あるいは JSON ファイルのみ受け付け（うけつけ）ます: 'word', 'reading', 'definition', 'part'"
      },
    }
};