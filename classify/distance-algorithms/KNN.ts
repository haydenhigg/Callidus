import Comp from "../../Comp";

export default class KNN {
    input: number[][];
    output: number[];

    constructor(input: number[][] = [], output: number[] = []) {
        this.input = input;
        this.output = output;
    }

    private assertModelValidity(model) {
        if (!model.input || !model.output)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {
            input: this.input,
            output: this.output
        };

        return JSON.stringify(jsonOb, null, space)
    }

    importJSON(jsonOb: string) {
        let model = JSON.parse(jsonOb);

        this.assertModelValidity(model);

        this.input = model.input;
        this.output = model.output;

        return this;
    }

    predict(x: number[], k: number = 1) {
        var diffs = this.input.map(i => Comp.euclideanDistance(i, x));
        var tdiffs = diffs.map(e => e);

        var mins = [];

        for (var i = 0; i < k; i++) {
            let ind = tdiffs.indexOf(Comp.min(tdiffs));
            mins.push(tdiffs[ind]);
            tdiffs.splice(ind, 1);
        }

        return this.output[diffs.indexOf(Comp.mostFrequent(mins))];
    }
};