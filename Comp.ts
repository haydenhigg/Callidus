export default class Comp {
    // number[]
    static mean(arr: number[]) {
        return this.sum(arr) / arr.length;
    }
    static median(unsorted: number[]) {
        let arr = unsorted.sort();

        if (arr.length % 2 !== 0) {
            return arr[Math.floor(arr.length / 2)];
        } else {
            let m1 = arr[Math.floor(arr.length / 2) - 1];
            let m2 = arr[Math.floor(arr.length / 2)];

            return this.mean([m1, m2]);
        }
    }
    static sum(arr: number[]) {
        return arr.reduce((s, n) => s + n, 0);
    }
    static product(arr: number[]) {
        return arr.reduce((s, n) => s * n, 0);
    }
    static max(arr: number[]) {
        let max = arr[0];

        arr.forEach(i => { if (i > max) max = i; });

        return max;
    }
    static min(arr: number[]) {
        let min = arr[0];

        arr.forEach(i => { if (i < min) min = i; });

        return min;
    }
    static maxIndex(arr: number[]) {
        return arr.indexOf(this.max(arr));
    }
    static minIndex(arr: number[]) {
        return arr.indexOf(this.min(arr));
    }
    static dot(arr: number[], arr2: number[]) {
        return arr.reduce((s, n, i) => s + n * arr2[i], 0);
    }
    static covariance(arr: number[]) {
        let mean = this.mean(arr);

        let variance = this.sum(arr.map(i => (i - mean) ** 2)) / (arr.length - 1);
        
        return variance;
    }
    static stdev(arr: number[]) {
        let mean = this.mean(arr);

        let diffs = arr.map(i => (i - mean) ** 2);

        return Math.sqrt(this.mean(diffs));
    }
    static norm(arr: number[], p: number = 2) {
        return (this.sum(arr.map(i => i ** p))) ** (1 / p);
    }
    static euclideanDistance(arr: number[], arr2: number[]) {
        return Math.sqrt(this.sum(arr.map((val, ind) => (val - arr2[ind]) ** 2)));
    }
    static randRange(arr: number[]) {
        return this.rand(this.min(arr), this.max(arr));
    }
    static randintRange(arr: number[]) {
        return this.randint(this.min(arr), this.max(arr));
    }
    static getRange(arr: number[]) {
        return [this.min(arr), this.max(arr)];
    }
    static makeRange(min: number, max: number) {
        return [...Array(max - min + 1).keys()].map(i => i + min);
    }

    // any[]
    static unique(arr: any[]) {
        return [...new Set(arr)];
    }
    static mostFrequent(arr: any[]) {
        let freqs = {};

        arr.forEach(i => {
            if (freqs.hasOwnProperty(i))
                freqs[i] = freqs[i] + 1;
            else
                freqs[i] = 1;
        });

        let values = Object.keys(freqs).map(k => freqs[k]);

        return arr[values.indexOf(this.max(values))];
    }
    static flatten(arr: any[]) {
        return [].concat(...arr);
    }
    static arrayEquals(arr: any[], arr2: any[]) {
        return arr.filter((val, ind) => val !== arr2[ind]).length === 0;
    }
    static last(arr: any[]) {
        return arr[arr.length - 1];
    }

    // object
    static values(ob: object) {
        return Object.keys(ob).map(k => ob[k]);
    }
    static argmax(ob: object) {
        return Object.keys(ob)[this.values(ob).indexOf(this.max(this.values(ob)))]
    }
    static argmin(ob: object) {
        return Object.keys(ob)[this.values(ob).indexOf(this.min(this.values(ob)))]
    }

    // number
    static roundTo(n: number, places: number = 3) {
        return +(Math.round(parseFloat(n.toString() + "e+" + places.toString())) + "e-" + places)
    }
    static divisor(n: number, k: number) {
        var factors = [];

        for (var i = 1; i <= n; i++)
            if (n % i === 0)
                factors.push(i);

        return this.sum(factors.map(i => i ** k));
    }
    static rand(min: number, max: number) {
        return (Math.random() * (max - min)) + min;
    }
    static randint(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // number[][]
    static matrixOp(m1: number[][], m2: number[][], cb: (a: number, b: number) => number) {
        var ret = [];

        for (var row in m1) {
            ret[row] = [];

            for (var column in m1[row]) {
                ret[row][column] = cb(m1[row][column], m2[row][column] || m2[row][m2[0].length - 1] || m2[row.length - 1][column] || m2[row.length - 1][column.length - 1]);
            }
        }

        return ret;
    }
    static matrixMultiply(m1: number[][], m2: number[][]) {
        var ret = [];

        for (var i = 0; i < m1.length; i++) {
            ret[i] = [];

            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;

                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                
                ret[i][j] = sum;
            }
        }

        return ret;
    }
    static matrixTranspose(mat: number[][]) {
        var ret = [];

        for (var column in mat[0]) {
            ret[column] = mat.map(row => row[column]);
        }

        return ret;
    }
    static matrixInverse(mat: number[][]) {
        var dim = mat.length;
        var I = [];
        var C = [];
        var e;

        for(var i = 0; i < dim; i++) {
            I.push([]);
            C.push([]);

            for (var j = 0; j < dim; j++) {
                if (i==j)
                    I[i][j] = 1;
                else
                    I[i][j] = 0;
                
                C[i][j] = mat[i][j];
            }
        }
        
        for(var i = 0; i < dim; i++) {
            e = C[i][i];
            
            if (e == 0){
                for(var ii = i + 1; ii < dim; ii++) {
                    if(C[ii][i] != 0) {
                        for (var j = 0; j < dim; j++) {
                            e = C[i][j];        //temp store i'th row
                            C[i][j] = C[ii][j]; //replace i'th row by ii'th
                            C[ii][j] = e;       //repace ii'th by temp
                            e = I[i][j];        //temp store i'th row
                            I[i][j] = I[ii][j]; //replace i'th row by ii'th
                            I[ii][j] = e;       //repace ii'th by temp
                        }

                        break;
                    }
                }

                e = C[i][i];

                if (e === 0)
                    return;
            }
            
            for (var j = 0; j < dim; j++) {
                C[i][j] = C[i][j] / e; //apply to original matrix
                I[i][j] = I[i][j] / e; //apply to identity
            }
            
            for(var ii = 0; ii < dim; ii++) {
                if ( ii === i)
                    continue;

                e = C[ii][i];

                for(var j = 0; j < dim; j++) {
                    C[ii][j] -= e * C[i][j]; //apply to original matrix
                    I[ii][j] -= e * I[i][j]; //apply to identity
                }
            }
        }

        return I;
    }

    // functions/constants
    static linear(x: number) {
        return x;
    }
    static sigmoid(x: number) {
        return 1 / (1 + this.e ** -x);
    }
    static tanh(x: number) {
        return (2 / (1 + this.e ** (-2 * x))) - 1;
    }
    static arcTan(x: number) {
        return Math.atan(x);
    }
    static softPlus(x: number) {
        return Math.log(1 + Comp.e ** x);
    }
    static relu(x: number) {
        return (x < 0 ? 0 : x);
    }
    static leakyRelu(a: number = 0.01) {
        return function(x: number) {
            return (x < 0 ? a * x : x);
        }
    }
    static elu(a: number = 1) {
        return function(x: number) {
            return (x < 0 ? a * (Comp.e ** x - 1): x);
        }
    }
    static silu(x: number) {
        return x / (1 + Comp.e ** -x);
    }
    static get e() {
        return 2.7182818284590452353602;
    }
};