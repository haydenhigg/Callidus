import Comp from "../../Comp";

export default class KNN {
    input: number[][];
    output: number[];

    constructor(input: number[][] = [], output: number[] = []) {
        this.input = input;
        this.output = output;
    }

    predict(x: number[], k: number = 1) {
        var diffs = this.input.map(i => Comp.euclideanDistance(i, x));
        var tdiffs = diffs.map(e => e);

        var mins: number[] = [];

        for (var i = 0; i < k; i++) {
            let ind = tdiffs.indexOf(Comp.min(tdiffs));
            mins.push(tdiffs[ind]);
            tdiffs.splice(ind, 1);
        }

        return this.output[diffs.indexOf(Comp.mostFrequent(mins))];
    }
};