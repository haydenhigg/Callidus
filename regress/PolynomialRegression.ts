import Comp from "../Comp";

export default class Polynomial {
    input: number[];
    output: number[];
    
    degree: number;

    coefficients: number[];
    predictedOutput: number[];

    private trained: boolean = false;

    constructor(input: number[] = [], output: number[] = [], degree: number = 2) {
        this.input = input;
        this.output = output;
        this.degree = degree;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    private assertModelValidity(model) {
        if (!model.input || !model.output || !model.deg || !model.coefficients || !model.predOut)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {
            input: this.input,
            output: this.output,
            deg: this.degree,
            coefficients: this.coefficients,
            predOut: this.predictedOutput
        };

        return JSON.stringify(jsonOb, null, space)
    }

    importJSON(jsonOb: string) {
        let model = JSON.parse(jsonOb);

        this.assertModelValidity(model);

        this.input = model.input;
        this.output = model.output;
        this.degree = model.deg;
        this.coefficients = model.coefficients;
        this.predictedOutput = model.predOut;

        this.trained = true;

        return this;
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

        return 1 - Comp.roundTo(1 - Math.sqrt(Comp.sum(diffs) / (n - 2)));
    }

    train() {
        var coefficientInits = this.input.map(i => Comp.makeRange(0, this.degree).map(power => i ** power));

        let t = Comp.matrixTranspose;
        let inv = Comp.matrixInverse;
        let mult = Comp.matrixMultiply;

        let mx = coefficientInits;
        let my = this.output.map(y => [y]);
        let mxt = t(mx);

        this.coefficients = t(mult(mult(inv(mult(mxt, mx)), mxt), my))[0].map(i => Comp.roundTo(i));

        this.predictedOutput = this.input.map(x => Comp.roundTo(this.coefficients.reduce((s, c, i) => s + (c * (x ** i)))));

        this.trained = true;

        return this;
    }

    predict(x: number) {
        this.assertTrained();

        return this.coefficients.reduce((s, c, i) => s + (c * (x ** i)));
    }
};