export default class Porter2 {
    private static EXCEPTIONAL_FORMS4: { [k: string]: string } = {
        "skis": "ski",
        "idly": "idl",
        "ugly": "ugli",
        "only": "onli",
        "news": "news",
        "howe": "howe",
        "bias": "bias",
    };

    private static EXCEPTIONAL_FORMS5: { [k: string]: string } = {
        "skies": "sky",
        "dying": "die",
        "lying": "lie",
        "tying": "tie",
        "early": "earli",
        "atlas": "atlas",
        "andes": "andes",
    };

    private static EXCEPTIONAL_FORMS6: { [k: string]: string } = {
        "gently": "gentl",
        "singly": "singl",
        "cosmos": "cosmos",
    };

    // Exceptional forms post 1a step
    private static EXCEPTIONAL_FORMS_POST_1A: { [k: string]: number } = {
        "inning": 0,
        "outing": 0,
        "canning": 0,
        "herring": 0,
        "earring": 0,
        "proceed": 0,
        "exceed": 0,
        "succeed": 0,
    };

    private static RANGE_RE = /[^aeiouy]*[aeiouy]+[^aeiouy](\w*)/;

    private static EWSS1_RE = /^[aeiouy][^aeiouy]$/;
    private static EWSS2_RE = /.*[^aeiouy][aeiouy][^aeiouywxY]$/;

    private static isEndsWithShortSyllable(word: string): boolean {
        if (word.length === 2) {
            return Porter2.EWSS1_RE.test(word);
        }
        return Porter2.EWSS2_RE.test(word);
    }

    // Capitalize consonant regexp
    private static CCY_RE = /([aeiouy])y/g;
    private static S1A_RE = /[aeiouy]./;

    private static step1bHelper(word: string, r1: number): string {
        if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz")) {
            return word + "e";
        }
        // double ending
        const l0 = word.charCodeAt(word.length - 1);
        // /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/
        if (l0 === word.charCodeAt(word.length - 2) &&
            (l0 === 98 ||
                l0 === 100 || l0 === 102 ||
                l0 === 103 || l0 === 109 ||
                l0 === 110 || l0 === 112 ||
                l0 === 114 || l0 === 116)) {

            return word.slice(0, -1);
        }
        // is short word
        if (r1 === word.length && Porter2.isEndsWithShortSyllable(word)) {
            return word + "e";
        }
        return word;
    }

    private static S1BSUFFIXES_RE = /(ed|edly|ing|ingly)$/;
    private static S1B_RE = /[aeiouy]/;

    private static step1b(word: string, r1: number): string {
        if (word.endsWith("eedly")) {
            if (word.length - 5 >= r1) {
                return word.slice(0, -3);
            }
            return word;
        }
        if (word.endsWith("eed")) {
            if (word.length - 3 >= r1) {
                return word.slice(0, -1);
            }
            return word;
        }
        const match = Porter2.S1BSUFFIXES_RE.exec(word);
        if (match) {
            const preceding = word.slice(0, -match[0].length);
            if (word.length > 1 && Porter2.S1B_RE.test(preceding)) {
                return Porter2.step1bHelper(preceding, r1);
            }
        }

        return word;
    }

    private static step2Helper(word: string, r1: number, end: string, repl: string, prev: string[] | null): string | null {
        if (word.endsWith(end)) {
            if ((word.length - end.length) >= r1) {
                const w = word.slice(0, -end.length);
                if (prev === null) {
                    return w + repl;
                }
                for (let i = 0; i < prev.length; i++) {
                    const p = prev[i];
                    if (w.endsWith(p)) {
                        return w + repl;
                    }
                }
            }
            return word;
        }
        return null;
    }

    private static S2_TRIPLES: Array<[string, string, Array<string> | null]> = [
        ["enci", "ence", null],
        ["anci", "ance", null],
        ["abli", "able", null],
        ["izer", "ize", null],
        ["ator", "ate", null],
        ["alli", "al", null],
        ["bli", "ble", null],
        ["ogi", "og", ["l"]],
        ["li", "", ["c", "d", "e", "g", "h", "k", "m", "n", "r", "t"]],
    ];

    private static S2_TRIPLES5 = ([
        ["ization", "ize", null],
        ["ational", "ate", null],
        ["fulness", "ful", null],
        ["ousness", "ous", null],
        ["iveness", "ive", null],
        ["tional", "tion", null],
        ["biliti", "ble", null],
        ["lessli", "less", null],
        ["entli", "ent", null],
        ["ation", "ate", null],
        ["alism", "al", null],
        ["aliti", "al", null],
        ["ousli", "ous", null],
        ["iviti", "ive", null],
        ["fulli", "ful", null],
    ] as Array<[string, string, Array<string> | null]>).concat(Porter2.S2_TRIPLES);

    private static step2(word: string, r1: number): string {
        const triples = (word.length > 6) ? Porter2.S2_TRIPLES5 : Porter2.S2_TRIPLES;

        for (let i = 0; i < triples.length; i++) {
            const trip = triples[i];
            const attempt = Porter2.step2Helper(word, r1, trip[0], trip[1], trip[2]);
            if (attempt !== null) {
                return attempt;
            }
        }
        return word;
    }

    private static step3Helper(word: string, r1: number, r2: number, end: string, repl: string, r2_necessary: boolean) : string | null {

        if (word.endsWith(end)) {
            if (word.length - end.length >= r1) {
                if (!r2_necessary) {
                    return word.slice(0, -end.length) + repl;
                } else if (word.length - end.length >= r2) {
                    return word.slice(0, -end.length) + repl;
                }
            }
            return word;
        }
        return null;
    }

    private static S3_TRIPLES: Array<{ a: string, b: string, c: boolean }> = [
        { a: "ational", b: "ate", c: false },
        { a: "tional", b: "tion", c: false },
        { a: "alize", b: "al", c: false },
        { a: "icate", b: "ic", c: false },
        { a: "iciti", b: "ic", c: false },
        { a: "ative", b: "", c: true },
        { a: "ical", b: "ic", c: false },
        { a: "ness", b: "", c: false },
        { a: "ful", b: "", c: false },
    ];

    private static step3(word: string, r1: number, r2: number): string {
        for (let i = 0; i < Porter2.S3_TRIPLES.length; i++) {
            const trip = Porter2.S3_TRIPLES[i];
            const attempt = Porter2.step3Helper(word, r1, r2, trip.a, trip.b, trip.c);
            if (attempt !== null) {
                return attempt;
            }
        }
        return word;
    }

    private static S4_DELETE_LIST = ["al", "ance", "ence", "er", "ic", "able", "ible", "ant", "ement", "ment", "ent", "ism", "ate", "iti", "ous", "ive", "ize"];

    private static step4(word: string, r2: number): string {
        for (let i = 0; i < Porter2.S4_DELETE_LIST.length; i++) {
            const end = Porter2.S4_DELETE_LIST[i];
            if (word.endsWith(end)) {
                if (word.length - end.length >= r2) {
                    return word.slice(0, -end.length);
                }
                return word;
            }
        }

        if ((word.length - 3) >= r2) {
            const l = word.charCodeAt(word.length - 4);
            if ((l === 115 || l === 116) && word.endsWith("ion")) { // s === 115 , t === 116
                return word.slice(0, -3);
            }
        }

        return word;
    }

    private static NORMALIZE_YS_RE = /Y/g;

    static tokenize(text: string, punctuation = /[.,\/#!$%\^&\*;:{}=\-_`'~()\?"“”]/g) {
		let words = text.toLowerCase().replace(punctuation, '').replace(/\s+/g, ' ').split(' ');

		return words.map(Porter2.stem);
	}
    static stem(word: string) {
        let l;
        let match: RegExpExecArray | null;
        let r1: number;
        let r2: number;

        if (word.length < 3) {
            return word;
        }

        // remove initial apostrophe
        if (word.charCodeAt(0) === 39) { // "'" === 39
            word = word.slice(1);
        }

        // handle exceptional forms
        if (word === "sky") {
            return word;
        } else if (word.length < 7) {
            if (word.length === 4) {
                if (Porter2.EXCEPTIONAL_FORMS4.hasOwnProperty(word)) {
                    return Porter2.EXCEPTIONAL_FORMS4[word];
                }
            } else if (word.length === 5) {
                if (Porter2.EXCEPTIONAL_FORMS5.hasOwnProperty(word)) {
                    return Porter2.EXCEPTIONAL_FORMS5[word];
                }
            } else if (word.length === 6) {
                if (Porter2.EXCEPTIONAL_FORMS6.hasOwnProperty(word)) {
                    return Porter2.EXCEPTIONAL_FORMS6[word];
                }
            }
        }

        // capitalize consonant ys
        if (word.charCodeAt(0) === 121) { // "y" === 121
            word = "Y" + word.slice(1);
        }
        word = word.replace(Porter2.CCY_RE, "$1Y");

        // r1
        if (word.length > 4 && (word.startsWith("gener") || word.startsWith("arsen"))) {
            r1 = 5;
        } else if (word.startsWith("commun")) {
            r1 = 6;
        } else {
            match = Porter2.RANGE_RE.exec(word);
            r1 = (match) ? word.length - match[1].length : word.length;
        }

        // r2
        match = Porter2.RANGE_RE.exec(word.slice(r1));
        r2 = match ? word.length - match[1].length : word.length;

        // step 0
        if (word.charCodeAt(word.length - 1) === 39) { // "'" === 39
            if (word.endsWith("'s'")) {
                word = word.slice(0, -3);
            } else {
                word = word.slice(0, -1);
            }
        } else if (word.endsWith("'s")) {
            word = word.slice(0, -2);
        }

        // step 1a
        if (word.endsWith("sses")) {
            word = word.slice(0, -4) + "ss";
        } else if (word.endsWith("ied") || word.endsWith("ies")) {
            word = word.slice(0, -3) + ((word.length > 4) ? "i" : "ie");
        } else if (word.endsWith("us") || word.endsWith("ss")) {
            word = word;
        } else if (word.charCodeAt(word.length - 1) === 115) { // "s" == 115
            const preceding = word.slice(0, -1);
            if (Porter2.S1A_RE.test(preceding)) {
                word = preceding;
            }
        }

        // handle exceptional forms post 1a
        if ((word.length === 6 || word.length === 7) && Porter2.EXCEPTIONAL_FORMS_POST_1A.hasOwnProperty(word)) {
            return word;
        }

        word = Porter2.step1b(word, r1);

        // step 1c
        if (word.length > 2) {
            l = word.charCodeAt(word.length - 1);
            if (l === 121 || l === 89) {
                l = word.charCodeAt(word.length - 2);
                // "a|e|i|o|u|y"
                if (l < 97 || l > 121 || (l !== 97 && l !== 101 && l !== 105 && l !== 111 && l !== 117 && l !== 121)) {
                    word = word.slice(0, -1) + "i";
                }
            }
        }

        word = Porter2.step2(word, r1);
        word = Porter2.step3(word, r1, r2);
        word = Porter2.step4(word, r2);

        // step 5
        l = word.charCodeAt(word.length - 1);

        if (l === 108) { // l = 108
            if (word.length - 1 >= r2 && word.charCodeAt(word.length - 2) === 108) { // l === 108
                word = word.slice(0, -1);
            }
        } else if (l === 101) { // e = 101
            if (word.length - 1 >= r2) {
                word = word.slice(0, -1);
            } else if (word.length - 1 >= r1 && !Porter2.isEndsWithShortSyllable(word.slice(0, -1))) {
                word = word.slice(0, -1);
            }
        }

        // normalize Ys
        word = word.replace(Porter2.NORMALIZE_YS_RE, "y");

        return word;
    }
};