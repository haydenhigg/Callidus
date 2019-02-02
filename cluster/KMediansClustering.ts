import Comp from "../Comp";

export default class KMedians {
    input: number[][];

    centroids: number[][];

    constructor(input: number[][] = []) {
        this.input = input;
    }

    train(k, maxIterations = 10000) {
        this.centroids = this.centroids || Array.from(Array(k), () => this.input[0].map((_, i) => Comp.randRange(this.input.map(inp => inp[i]))));

        var pastCentroids = [];
        var count = 0;

        while (count < maxIterations) {
            pastCentroids = this.centroids.map(e => e);
            
            // allocate points to clusters
            var clusters = Array.from(Array(k), () => []);
            var clustered = this.input.map(inp => Comp.minIndex(this.centroids.map(centroid => Comp.euclideanDistance(inp, centroid))));

            for (let cluster in clustered) {
                clusters[clustered[cluster]].push(this.input[cluster]);
            }

            // redetermine centroids
            for (var c = 0; c < clusters.length; c++) {
                if (clusters[c].length > 0) {
                    this.centroids[c] = [];
                    
                    for (var feature = 0; feature < clusters[c][0].length; feature++) {
                        this.centroids[c].push(Comp.median(clusters[c].map(e => e[feature])));
                    }
                }
            }

            if (this.centroids.filter((val, ind) => !Comp.arrayEquals(val, pastCentroids[ind])).length === 0) {
                break;
            }
            
            count++;
        }

        return this;
    }

    trainFor(k, iterations = 1) {
        this.centroids = this.centroids || Array.from(Array(k), () => this.input[0].map((_, i) => Comp.randRange(this.input.map(inp => inp[i]))));

        for (var _i = 0; _i < iterations; _i++) {
            // allocate points to clusters
            var clusters = Array.from(Array(k), () => []);
            var clustered = this.input.map(inp => Comp.minIndex(this.centroids.map(centroid => Comp.euclideanDistance(inp, centroid))));

            for (let cluster in clustered) {
                clusters[clustered[cluster]].push(this.input[cluster]);
            }

            // redetermine centroids
            for (var c = 0; c < clusters.length; c++) {
                if (clusters[c].length > 0) {
                    this.centroids[c] = [];
                    
                    for (var feature = 0; feature < clusters[c][0].length; feature++) {
                        this.centroids[c].push(Comp.median(clusters[c].map(e => e[feature])));
                    }
                }
            }
        }

        return this;
    }
};