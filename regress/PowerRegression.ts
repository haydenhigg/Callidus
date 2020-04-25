import Comp from "../Comp";

export default class Power {
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

    private assertModelValidity(model) {
        if (!model.input || !model.output || !model.a || !model.b || !model.predOut)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {
            input: this.input,
            output: this.output,
            a: this.a,
            b: this.b,
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
        this.predictedOutput = model.predOut;

        this.trained = true;

        return this;
    }

    findCorrelation() {
        this.assertTrained("findCorrelation");

        var meanLnY = Comp.mean(this.output.map(i => Math.log(i)));
        var meanLnX = Comp.mean(this.input.map(i => Math.log(i)));

        if (meanLnX === Infinity || meanLnY === Infinity) {
            throw new Error("can not find ln(0)");
        }

        var sumXX = 0;
        var sumXY = 0;
        var sumYY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += Math.log(x) * Math.log(x);
            sumXY += Math.log(x) * Math.log(y);
            sumYY += Math.log(y) * Math.log(y);
        }

        sumXX = sumXX / n - meanLnX * meanLnX;
        sumXY = sumXY / n - meanLnX * meanLnY;
        sumYY = sumYY / n - meanLnY * meanLnY;

        return Comp.roundTo(sumXY / (Math.sqrt(sumXX * sumYY)));
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
        var meanLnY = Comp.mean(this.output.map(i => Math.log(i)));
        var meanLnX = Comp.mean(this.input.map(i => Math.log(i)));

        if (meanLnX === Infinity || meanLnY === Infinity) {
            throw new Error("can not find ln(0)");
        }

        var sumXX = 0;
        var sumXY = 0;
        var sumYY = 0;

        var n = this.input.length;

        for (var i = 0; i < n; i++) {
            let x = this.input[i];
            let y = this.output[i];

            sumXX += Math.log(x) * Math.log(x);
            sumXY += Math.log(x) * Math.log(y);
            sumYY += Math.log(y) * Math.log(y);
        }

        sumXX = sumXX / n - meanLnX * meanLnX;
        sumXY = sumXY / n - meanLnX * meanLnY;
        sumYY = sumYY / n - meanLnY * meanLnY;

        this.b = sumXY / sumXX;
        this.a = Comp.e ** (meanLnY - this.b * meanLnX);

        this.predictedOutput = Comp.unique(this.input).map(x => Comp.roundTo(this.a * (x ** this.b)));

        this.trained = true;

        return this;
    }

    predict(x: number) {
        this.assertTrained();

        return Comp.roundTo(this.a * (x ** this.b));
    }
};