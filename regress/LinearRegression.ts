import Comp from "../Comp";

export default class Linear {
    input: number[];
    output: number[];

    slope: number = null;
    yIntercept: number = null;
    predictedOutput: number[] = [];

    private trained: boolean = false;

    constructor(input: number[] = [], output: number[] = []) {
        this.input = input;
        this.output = output;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    findCorrelation() {
        this.assertTrained("findCorrelation");

        var diffcb = y => (y - Comp.mean(this.output)) ** 2

        var diffYM = this.output.map(diffcb);
        var diffPYM = this.predictedOutput.map(diffcb);

        return Comp.roundTo(Comp.sum(diffPYM) / Comp.sum(diffYM));
    }

    findStandardError() {
        this.assertTrained("findStandardError");

        var n = this.input.length;

        var diffs: number[] = [];

        for (var i = 0; i < n; i++) {
            diffs.push((this.predictedOutput[i] - this.output[i]) ** 2);
        }

        return Comp.roundTo(Math.sqrt(Comp.sum(diffs) / (n - 2)));
    }

    train() {
        var sumX = 0;
        var sumY = 0;
        var sumXX = 0;
        var sumXY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumX += x;
            sumY += y;
            sumXX += x * x;
            sumXY += x * y
        }

        this.slope = Comp.roundTo((n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX));
        this.yIntercept = Comp.roundTo((sumY - (this.slope * sumX)) / n);

        this.predictedOutput = this.input.map(x => Comp.roundTo(x * this.slope + this.yIntercept));

        this.trained = true;

        return this;
    }

    predict(x: number) {
        this.assertTrained();

        return Comp.roundTo(x * this.slope + this.yIntercept);
    }
};