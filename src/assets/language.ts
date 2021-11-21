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
            question: "Question",
            answer: "Answer",
            replay_worst_in_current_mode: "Drill the worst in the current mode",
            mode_replay: "Drill mode",
            new_words: 'New Words List',
        },
        error: {
            headersmissing: "The fields ({headers}) present in '{filename}' doesn't include every expected field.",
            filetype: "Only CSV or JSON files with fields 'word', 'reading', 'definition', 'part' are accepted.",
            already_used: "The name {fileName} is already used for another file.",
            required: "Required.",
        },
        message: {
            bravo: {
                worst: "Good job! As you answered correctly consecutively twice for {word}, I erased 1 bad answer from its history! ({ok}/{all})",
            },
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
            question: "Question",
            answer: "Réponse",
            replay_worst_in_current_mode: "Réapprendre les pires dans la mode courante",
            mode_replay: "Mode replay",
            new_words: 'Nouvelle liste des mots',
        },
        error: {
            headersmissing: "Les champs ({headers}) présents dans '{filename}' n'incluent pas tous les champs requis.",
            filetype: "Seuls les fichiers CSV ou JSON ayant les champs 'word', 'reading', 'definition' et 'part' sont acceptés.",
            already_used: "Le nom {fileName} est déjà utilisé pour un autre fichier.",
            required: "Requis.",
        },
        message: {
            bravo: {
                worst: "Bravo ! Comme tu as fait la bonne réponse deux fois de suite pour {word}, j'ai effacé une mauvaise réponse de l'historique du mot pour toi ! ({ok}/{all})",
            },
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
            question: "質問（しつもん）",
            answer: "解答（かいとう）",
            replay_worst_in_current_mode: "現行（げんこう）モードで復習（ふくしゅう）する",
            mode_replay: "ドリルモード",
            new_words: '新規（しんき）のリスト',
        },
        error: {
            headersmissing: "ファイル '{filename}' 中（ちゅう）に見（み）つかったフィールド ({headers}) は必要（ひつよう）なフィールドをすべて含（ふく）んでません。",
            filetype: "以下（いか）のフィールドを含（ふく）んだ CSV あるいは JSON ファイルのみ受け付け（うけつけ）ます: 'word', 'reading', 'definition', 'part'",
            already_used: "ファイル名 {fileName} はすでに使（つか）われています。",
            required: "必須（ひっす）項目（こうもく）です。",
        },
        message: {
            bravo: {
                worst: "すごい！{word}２回（かい）連続（れんぞく）正解（せいかい）したので、過去（かこ）の解答（かいとう）歴（れき）から一つ不正解（ふせいかい）の解答（かいとう）を消去（しょうきょ）しましたよ。({ok}/{all})",
            },
        },
    }
};