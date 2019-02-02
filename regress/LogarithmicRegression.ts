import Comp from "../Comp";

export default class Logarithmic {
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
        var meanLnX = Comp.mean(this.input.map(i => Math.log(i)));

        var sumXX = 0;
        var sumXY = 0;
        var sumYY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += Math.log(x) * Math.log(x);
            sumXY += Math.log(x) * y;
            sumYY += y * y;
        }

        sumXX = sumXX / n - meanLnX * meanLnX;
        sumXY = sumXY / n - meanLnX * meanY;
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
        var meanLnX = Comp.mean(this.input.map(i => Math.log(i)));

        var sumXX = 0;
        var sumXY = 0;
        var sumYY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += Math.log(x) * Math.log(x);
            sumXY += Math.log(x) * y;
            sumYY += y * y;
        }

        sumXX = sumXX / n - meanLnX * meanLnX;
        sumXY = sumXY / n - meanLnX * meanY;
        sumYY = sumYY / n - meanY * meanY;

        this.b = sumXY / sumXX;
        this.a = meanY - this.b * meanLnX;

        this.predictedOutput = this.input.map(x => Comp.roundTo(this.a + this.b * Math.log(x)));

        this.trained = true;

        return this;
    }

    predict(x: number) {
        this.assertTrained();

        return Comp.roundTo(this.a + this.b * Math.log(x));
    }
};