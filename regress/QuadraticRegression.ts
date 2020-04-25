import Comp from "../Comp";

export default class Quadratic {
    input: number[];
    output: number[];

    a: number = null;
    b: number = null;
    c: number = null;
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

    private assertModelValidity(model) {
        if (!model.input || !model.output || !model.a || !model.b || !model.c || !model.predOut)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {
            input: this.input,
            output: this.output,
            a: this.a,
            b: this.b,
            c: this.c,
            predOut: this.predictedOutput
        };

        return JSON.stringify(jsonOb, null, space)
    }

    importJSON(jsonOb: string) {
        let model = JSON.parse(jsonOb);

        this.assertModelValidity(model);

        this.input = model.input;
        this.output = model.output;
        this.a = model.a;
        this.b = model.b;
        this.c = model.c;
        this.predictedOutput = model.predOut;

        this.trained = true;

        return this;
    }

    findCorrelation() {
        this.assertTrained("findCorrelation");

        var meanY = Comp.mean(this.output);

        var n = this.input.length;
        var pred = x => this.a + this.b * x + this.c * x * x;

        var numerator = 0;
        var denominator = 0;

        for (var i = 0; i < n; i++) {
            numerator += (this.output[i] - pred(this.input[i])) ** 2;
            denominator += (this.output[i] - meanY) ** 2;
        }

        return Comp.roundTo(Math.sqrt(1 - numerator / denominator));
    }

    findStandardError() {
        this.assertTrained("findStandardError");

        var n = this.input.length;

        var diffs: number[] = [];

        for (var i = 0; i < n; i++) {
            diffs.push((this.predictedOutput[i] - this.output[i]) ** 2);
        }

        return 1 - Comp.roundTo(1 - Math.sqrt(Comp.sum(diffs) / (n - 2)));
    }

    train() {
        var meanY = Comp.mean(this.output);
        var meanX = Comp.mean(this.input);
        var meanX2 = Comp.mean(this.input.map(i => i * i));

        var sumXX = 0;
        var sumXY = 0;
        var sumXX2 = 0;
        var sumX2X2 = 0;
        var sumX2Y = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += x * x;
            sumXY += x * y;
            sumXX2 += x * x * x;
            sumX2X2 += x * x * x * x;
            sumX2Y += x * x * y;
        }

        sumXX = sumXX / n - meanX * meanX;
        sumXY = sumXY / n - meanX * meanY;
        sumXX2 = sumXX2 / n - meanX * meanX2;
        sumX2X2 = sumX2X2 / n - meanX2 * meanX2;
        sumX2Y = sumX2Y / n - meanX2 * meanY;

        this.b = (sumXY * sumX2X2 - sumX2Y * sumXX2) / (sumXX * sumX2X2 - sumXX2 * sumXX2);
        this.c = (sumX2Y * sumXX - sumXY * sumXX2) / (sumXX * sumX2X2 - sumXX2 * sumXX2);
        this.a = meanY - this.b * meanX - this.c * meanX2;

        this.predictedOutput = Comp.unique(this.input).map(x => Comp.roundTo(this.a + this.b * x + this.c * x * x));

        this.trained = true;

        return this;
    }

    predict(x: number) {
        this.assertTrained();

        return Comp.roundTo(this.a + this.b * x + this.c * x * x);
    }
};