export default class Porter {
	private static step2list = {
        "ational" : "ate",
        "tional" : "tion",
        "enci" : "ence",
        "anci" : "ance",
        "izer" : "ize",
        "bli" : "ble",
        "alli" : "al",
        "entli" : "ent",
        "eli" : "e",
        "ousli" : "ous",
        "ization" : "ize",
        "ation" : "ate",
        "ator" : "ate",
        "alism" : "al",
        "iveness" : "ive",
        "fulness" : "ful",
        "ousness" : "ous",
        "aliti" : "al",
        "iviti" : "ive",
        "biliti" : "ble",
        "logi" : "log"
    };

    private static step3list = {
        "icate" : "ic",
        "ative" : "",
        "alize" : "al",
        "iciti" : "ic",
        "ical" : "ic",
        "ful" : "",
        "ness" : ""
    };

    private static c = "[^aeiou]";
    private static v = "[aeiouy]";
    private static C = Porter.c + "[^aeiouy]*";
    private static V = Porter.v + "[aeiou]*";

    private static mgr0 = "^(" + Porter.C + ")?" + Porter.V + Porter.C;
    private static meq1 = "^(" + Porter.C + ")?" + Porter.V + Porter.C + "(" + Porter.V + ")?$";
    private static mgr1 = "^(" + Porter.C + ")?" + Porter.V + Porter.C + Porter.V + Porter.C;
    private static s_v = "^(" + Porter.C + ")?" + Porter.v;

	static tokenize(text: string, punctuation = /[.,\/#!$%\^&\*;:{}=\-_`'~()\?]/g) {
		let words = text.toLowerCase().replace(punctuation, '').replace(/\s+/g, ' ').split(' ');

		return words.map(Porter.stem);
	}
	static stem(w: string) {
		var stem,
			suffix,
			firstch,
			re,
			re2,
			re3,
			re4;

        if (w.length < 3)
            return w;

		firstch = w.substr(0,1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) { w = w.replace(re,"$1$2"); }
		else if (re2.test(w)) {	w = w.replace(re2,"$1$2"); }

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			let fp = re.exec(w);
            re = new RegExp(Porter.mgr0);
            
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re,"");
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(Porter.s_v);
			if (re2.test(stem)) {
				w = stem;
				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + Porter.C + Porter.v + "[^aeiouwxy]$");
				if (re2.test(w)) {	w = w + "e"; }
				else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
				else if (re4.test(w)) { w = w + "e"; }
			}
		}

		// Step 1c
		re = /^(.+?)y$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(Porter.s_v);
			if (re.test(stem)) { w = stem + "i"; }
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(Porter.mgr0);
			if (re.test(stem)) {
				w = stem + Porter.step2list[suffix];
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(Porter.mgr0);
			if (re.test(stem)) {
				w = stem + Porter.step3list[suffix];
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(Porter.mgr1);
			if (re.test(stem)) {
				w = stem;
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(Porter.mgr1);
			if (re2.test(stem)) {
				w = stem;
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(Porter.mgr1);
			re2 = new RegExp(Porter.meq1);
			re3 = new RegExp("^" + Porter.C + Porter.v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
			}
		}

		re = /ll$/;
		re2 = new RegExp(Porter.mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re,"");
		}

		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}

		return w;
	}
};