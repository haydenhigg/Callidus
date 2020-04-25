import Comp from "../../Comp";

export default class ZeroR {
    output: any[];

    constructor(output: any[] = []) {
        this.output = output;
    }

    private assertModelValidity(model) {
        if (!model.output)
            throw new Error("JSON string in wrong form in `importJSON`");
    }

    exportJSON(space: number = 0) {
        let jsonOb = {output: this.output};

        return JSON.stringify(jsonOb, null, space)
    }

    importJSON(jsonOb: string) {
        let model = JSON.parse(jsonOb);

        this.assertModelValidity(model);

        this.output = model.output;

        return this;
    }

    predict() {
        var score = {};

        for (let c of Comp.unique(this.output)) {
            score[c] = this.output.filter(tc => tc === c).length;
        }

        return Comp.argmax(score);
    }
};