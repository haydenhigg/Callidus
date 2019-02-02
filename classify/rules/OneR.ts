import Comp from "../../Comp";

export default class OneR {
    input: any[][];
    output: any[];

    rule: object = {};

    private trained = false;

    constructor(input: any[][] = [], output: any[] = []) {
        this.input = input;
        this.output = output;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    train() {
        this.trained = true;

        var rules = {};
        var errors = {};

        for (let feature in this.input[0]) {
            rules[feature] = {};
            errors[feature] = {};

            for (let value of this.input.map(inp => inp[feature])) {
                let outputsWithValue = this.output.filter((_, i) => this.input[i][feature] === value);
                let mostFrequentClass = Comp.mostFrequent(outputsWithValue);

                rules[feature][value] = mostFrequentClass;

                var correct = 0;

                for (let inp in this.input) {
                    if (this.input[inp][feature] === value && this.output[inp] === mostFrequentClass)
                        correct++;
                }

                errors[feature][value] = correct;
            }
        }

        var totalAccuracies = {};

        for (let feature of Object.keys(errors)) {
            totalAccuracies[feature] = Comp.sum(Comp.values(errors[feature]));
        }

        this.rule = {
            attribute: parseInt(Comp.argmax(totalAccuracies)),
            values: rules[Comp.argmax(totalAccuracies)]
        }

        this.trained = true;

        return this;
    }

    predict(x: any[]) {
        this.assertTrained();

        let c = this.rule["values"][x[this.rule["attribute"]].toString()];
        let fallback = Comp.unique(this.output)[Comp.randint(0, Comp.unique(this.output).length - 1)];

        return (c === undefined ? fallback : c);
    }
};