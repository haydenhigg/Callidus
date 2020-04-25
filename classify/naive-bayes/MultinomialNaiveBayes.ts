import Comp from "../../Comp";

export default class MultinomialNB {
    input: any[][];
    output: any[];

    prior: object = {};
    condprob: object = {};

    private trained: boolean = false;

    constructor(input: any[][] = [], output: any[] = []) {
        this.input = input;
        this.output = output;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    private assertModelValidity(model) {
        if (!model.input || !model.output || !model.prior || !model.condprob)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {
            input: this.input,
            output: this.output,
            prior: this.prior,
            condprob: this.condprob
        };

        return JSON.stringify(jsonOb, null, space)
    }

    importJSON(jsonOb: string) {
        let model = JSON.parse(jsonOb);

        this.assertModelValidity(model);

        this.input = model.input;
        this.output = model.output;
        this.prior = model.prior;
        this.condprob = model.condprob;

        this.trained = true;

        return this;
    }

    train() {
        for (let c of Comp.unique(this.output)) {
            let vocabulary = Comp.unique(Comp.flatten(this.input));
            let examplesInClass = this.input.filter((_, i) => this.output[i] === c);

            this.prior[c] = examplesInClass.length / this.input.length;

            let tokenCounts = [];

            for (let feature of vocabulary) {
                let tokenCountFromAllExamplesInClass = Comp.flatten(examplesInClass).filter(token => token === feature).length;

                tokenCounts.push(tokenCountFromAllExamplesInClass);
            }

            for (var f = 0; f < vocabulary.length; f++) {
                let feature = vocabulary[f];

                if (!this.condprob.hasOwnProperty(feature))
                    this.condprob[feature] = {}

                this.condprob[feature][c] = (tokenCounts[f] + 1) / Comp.sum(tokenCounts.map(tc => tc + 1));
            }
        }

        this.trained = true;

        return this;
    }

    predict(x: any[]) {
        this.assertTrained();

        var score = {};

        for (let c of Comp.unique(this.output)) {
            score[c] = Math.log(this.prior[c]);

            let exampleTokens = x.filter(token => Comp.unique(Comp.flatten(this.input)).indexOf(token) !== -1);

            for (let feature of exampleTokens) {
                score[c] += Math.log(this.condprob[feature][c]);
            }
        }

        return Comp.argmax(score);
    }
}