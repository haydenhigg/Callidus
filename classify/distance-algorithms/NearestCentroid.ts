import Comp from "../../Comp";

export default class NearestCentroid {
    input: number[][];
    output: number[];

    centroids: object = {};

    private trained = false;

    constructor(input: number[][] = [], output: number[]) {
        this.input = input;
        this.output = output;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    train() {
        for (let c of Comp.unique(this.output)) {
            let examplesInClass = this.input.filter((_, i) => this.output[i] === c);

            this.centroids[c] = [];

            for (var feature = 0; feature < examplesInClass[0].length; feature++) {
                this.centroids[c].push(Comp.mean(examplesInClass.map(e => e[feature])));
            }
        }

        this.trained = true;

        return this;
    }

    predict(x: number[]) {
        this.assertTrained();

        let diffs = {};
        
        for (let c of Comp.unique(this.output)) {
            diffs[c] = Comp.euclideanDistance(x, this.centroids[c]);
        }
        
        return Comp.argmin(diffs);
    }
};
