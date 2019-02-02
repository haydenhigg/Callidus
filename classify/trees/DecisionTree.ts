import Comp from "../../Comp";

export default class DecisionTree {
    input: any[][];
    output: any[];

    private trained: boolean = false;

    constructor(input: any[][], output: any[]) {
        this.input = input;
        this.output = output;
    }

    private assertTrained(method = "predict") {
        if (!this.trained)
            throw new Error("you must train instance before calling `" + method + "`");
    }

    train(k: number = 1) {

        this.trained = true;

        return this;
    }

    predict(x: any[]) {
        this.assertTrained();

        return;
    }
};