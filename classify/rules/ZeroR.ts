import Comp from "../../Comp";

export default class ZeroR {
    output: any[];

    constructor(output: any[] = []) {
        this.output = output;
    }

    predict() {
        var score = {};

        for (let c of Comp.unique(this.output)) {
            score[c] = this.output.filter(tc => tc === c).length;
        }

        return Comp.argmax(score);
    }
};