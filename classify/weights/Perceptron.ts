import Comp from "../../Comp";

export default class Perceptron {
    input: number[][];
    output: number[];

    a: number;

    weights: number[] = [];

    private trained: boolean = false;

    constructor(input: number[][] = [], output: number[] = [], options: object = {}) {
        this.input = input;
        this.output = output;

        this.a = options["a"] || 1;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    private assertModelValidity(model) {
        if (!model.input || !model.output || !model.a || !model.weights)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {
            input: this.input,
            output: this.output,
            a: this.a,
            weights: this.weights
        };

        return JSON.stringify(jsonOb, null, space)
    }

    importJSON(jsonOb: string) {
        let model = JSON.parse(jsonOb);

        this.assertModelValidity(model);

        this.input = model.input;
        this.output = model.output;
        this.a = model.a;
        this.weights = model.weights;

        this.trained = true;

        return this;
    }

    train(gamma: number, maxIterations: number = 10000) {
        var c = 0;

        while (!this.trained) {
            this.weights = this.input[0].map(() => Math.random());

            var errSum = 0;

            let n1 = this.input.length;

            for (var j = 0; j < n1; j++) {
                let n2 = this.input[j].length;

                let dj = this.output[j];
                let yj = Comp.dot(this.weights, this.input[j]);

                let diff = dj - yj;

                errSum += Math.abs(diff);

                for (var i = 0; i < n2; i++) this.weights[i] += this.a * (diff * this.input[j][i]);
            }

            if (errSum / n1 < gamma)
                this.trained = true;

            if (c >= maxIterations)
                throw new Error(`could not converge to an error less than ${gamma} in under ${maxIterations} iterations`);

            c++;
        }

        return this;
    }

    trainFor(iterations: number = 1) {
        if (this.weights.length === 0)
            this.weights = this.input[0].map(() => Math.random());

        for (var _i = 0; _i < iterations; _i++) {
            let n1 = this.input.length;

            for (var j = 0; j < n1; j++) {
                let n2 = this.input[j].length;

                let dj = this.output[j];
                let yj = Comp.dot(this.weights, this.input[j]);

                let diff = dj - yj;
                
                for (var i = 0; i < n2; i++) this.weights[i] += this.a * (diff * this.input[j][i]);
            }
        }

        this.trained = true;

        return this;
    }

    predict(x: number[], bias: number = 0) {
        this.assertTrained();

        var probability = Comp.dot(this.weights, x) + bias;

        return (probability > 0 ? 1 : 0);
    }
};