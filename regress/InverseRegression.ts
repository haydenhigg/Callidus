import Comp from "../Comp";

export default class Inverse {
    input: number[];
    output: number[];

    a: number = null;
    b: number = null;
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

        var meanY = Comp.mean(this.output);
        var meanXi = Comp.mean(this.input.map(i => i ** -1));

        var sumXX = 0;
        var sumXY = 0;
        var sumYY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += 1 / (x * x);
            sumXY += (x ** -1) * y;
            sumYY += y * y;
        }

        sumXX = sumXX / n - meanXi * meanXi;
        sumXY = sumXY / n - meanXi * meanY;
        sumYY = sumYY / n - meanY * meanY;

        return Comp.roundTo(sumXY / (Math.sqrt(sumXX * sumYY)));
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
        var meanY = Comp.mean(this.output);
        var meanXi = Comp.mean(this.input.map(i => i ** -1));

        var sumXX = 0;
        var sumXY = 0;
        var sumYY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += 1 / (x * x);
            sumXY += (x ** -1) * y;
            sumYY += y * y;
        }

        sumXX = sumXX / n - meanXi * meanXi;
        sumXY = sumXY / n - meanXi * meanY;
        sumYY = sumYY / n - meanY * meanY;

        this.b = sumXY / sumXX;
        this.a = meanY - this.b * meanXi;

        this.predictedOutput = this.input.map(x => Comp.roundTo(this.a + this.b / x));

        this.trained = true;

        return this;
    }

    predict(x: number) {
        this.assertTrained();

        return Comp.roundTo(this.a + this.b / x);
    }
};