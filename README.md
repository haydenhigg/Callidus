# Callidus

A collection of machine-learning algorithms for Typescript.

Check [my website](http://www.thehiggy.com/static/callidus.html) to see a more intensive overview of the math and theory behind the algorithms.

## Notes:

The object that you require has the objects `Regress`, `Classify`, `Cluster`, and `Tools`. 
&nbsp;

`Regress` has
- [`Linear`](https://keisan.casio.com/exec/system/14059929550941)
- [`Logarithmic`](https://keisan.casio.com/exec/system/14059930226691)
- [`ExponentialE`](https://keisan.casio.com/exec/system/14059930754231)
- [`ExponentialAB`](https://keisan.casio.com/exec/system/14059930973581)
- [`Power`](https://keisan.casio.com/exec/system/14059931777261)
- [`Quadratic`](https://keisan.casio.com/exec/system/14059932254941)
- [`Inverse`](https://keisan.casio.com/exec/system/14059932105271)
&nbsp;

`Classify` has
- `Distance`: {
    + [`KNearestNeighbors`](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)
    + [`NearestCentroid`](https://en.wikipedia.org/wiki/Nearest_centroid_classifier)
}
- `Weights`: {
    + [`Perceptron`](https://en.wikipedia.org/wiki/Perceptron)
}
- `NaiveBayes`: {
    + [`Bernoulli`](https://nlp.stanford.edu/IR-book/html/htmledition/the-bernoulli-model-1.html)
    + [`Multinomial`](https://nlp.stanford.edu/IR-book/html/htmledition/naive-bayes-text-classification-1.html)
}
- `Rules`: {
    + [`ZeroR`](https://pdfs.semanticscholar.org/aa28/256df9a08f2a1707147f85c1d26fb283b453.pdf)
    + [`OneR`](http://www.soc.napier.ac.uk/~peter/vldb/dm/node8.html)
}
&nbsp;

`Cluster` has
- [`KMeans`](https://towardsdatascience.com/clustering-using-k-means-algorithm-81da00f156f6)
- [`KMedians`](https://en.wikipedia.org/wiki/K-medians_clustering)
&nbsp;

`Tools` has
- [`Porter`](https://tartarus.org/martin/PorterStemmer/js.txt)
- [`Porter2`](http://snowball.tartarus.org/algorithms/english/stemmer.html)

## Regress

These are algorithms for finding the best fit line between arrays of inputs/outputs based on a variety of functions.

### Initializing

Input and output must both be arrays of numbers.

- All: `constructor([input = [], output = []])`

### Training

Training:
- All: `train()`

### Predicting

Predicting:
- All: `predict()`

### Getting error and correlation

Error:
- All: `findStandardError()`

Correlation:
- All: `findCorrelation()`

### Putting it all together

```typescript
import { Regress } from "./Callidus/Callidus";

var input = [1, 2, 3, 4, 5];
var output = [2, 4, 8, 16, 32];

var model = new Regress.ExponentialAB(input, output);

console.log(model.train().predict(6)); //=> 64
```

## Classify

These are algorithms for categorizing arrays of input data into different classes based on a variety of methods.

### Initializing

For `KNearestNeighbors` and `Perceptron`, input must be an array of arrays of numbers, and output must be an array of numbers. For the Naive Bayes classifiers, the input must be an array of arrays of anything, and output must be an array of anything. Remember, when using the bayesian classifiers, you must not provide data with values based on index in the inputs as with the other classifiers; rather, it's recommended to use an array of unique feature names (like strings) so that the classifiers can see whether/how many times each of these features occurs in a given input. This works especially well for NLP, where you can pass an array of arrays of tokens or stems directly into these classifiers.

- `KNearestNeighbors`: `constructor([input = [], output = []])`
- `NearestCentroid`: `constructor([input = [], output = []])`
- `Perceptron`: `constructor([input = [], output = [], options = {a: 1}])` where a is the learning rate
- `Bernoulli`: `constructor([input = []], output = []])`
- `Multinomial`: `constructor([input = []], output = []])`
- `ZeroR`: `constructor([output = []])`
- `OneR`: `constructor([input = [], output = []])`

### Training

Batch training:
- `KNearestNeighbors`: doesn't need to be trained
- `NearestCentroid`: `train()`
- `Perceptron`: `train(gamma[, maxIterations = 10000])`
- `Bernoulli`: `train()`
- `Multinomial`: `train()`
- `ZeroR`: doesn't need to be trained
- `OneR`: `train()`

Online training (for any not specified here, just use the usual `train` method):
- `Perceptron`: `trainFor([iterations = 1])`

### Predicting

Predicting:
- `KNearestNeighbors`: `predict(x[, k = 1])`
- `NearestCentroid`: `predict(x)`
- `Perceptron`: `predict(x[, bias = 0])`
- `Bernoulli`: `predict(x)`
- `Multinomial`: `predict(x)`
- `ZeroR`: `predict()`
- `OneR`: `predict(x)`

### Putting it all together

Example 1:
```typescript
import { Classify } from "./Callidus/Callidus";

var input = [
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 0],
    [0, 1, 1]
];
var output = [1, 1, 0, 0];

var model = new Classify.Weights.Perceptron(input, output);

model.train(0.1); // gamma is 0.1, max iterations is not specified (so 10000)

console.log(model.predict([1, 0, 1])); //=> 1, because the first element of the inputs completely determines output
```
&nbsp;

Example 2:
```typescript
import { Classify, Tools } from "./Callidus/Callidus";

// aliases for the types (only for readability and ease-of-use; the types are so verbose for organization)
const Stemmer = Tools.Porter2;
const Classifier = Classify.NaiveBayes.Multinomial;

var input = [
    Stemmer.tokenize("This is certainly, very surely an english sentence with plenty of english words, and I hope that the classifier will be able to label it as an english sentence because that's exactly what it is."),
    Stemmer.tokenize("C’est certainement, très sûrement, une phrase français avec beaucoup de mots anglais, et j’espère que le classificateur pourra la qualifier de phrase français, car c’est exactement ce que c’est.")
];
var output = [
    'english',
    'french'
];

var model = new Classifier(input, output);

model.train();

console.log(model.predict(Stemmer.tokenize("Another sentence (guess what language this is in!)"))); //=> english
console.log(model.predict(Stemmer.tokenize("Une autre phrase (devine quelle langue ceci est!)"))); //=> french
```

## Cluster

These are unsupervised learning techniques that are made for clustering data.

### Initializing

As these algorithms are unsupervised, so you only provide the input (an array of arrays of numbers) to them.

- `KMeans`: `constructor([input = []])`
- `KMedians`: `constructor([input = []])`

### Training

Batch training:
- `KMeans`: `train(k[, maxIterations = 10000])`
- `KMedians`: `train(k[, maxIterations = 10000])`

Online training (for any not specified here, just use the usual `train` method):
- `KMeans`: `trainFor(k[, iterations = 1])`
- `KMedians`: `trainFor(k[, iterations = 1])`

### Getting the output

Centroids:
- `KMeans`: the `centroids` property, an array of arrays of numbers
- `KMedians`: the `centroids` property, an array of arrays of numbers

## Tools

### Porter

A classic stemming algorithm. Use the static methods `stem(word)` to find the stem of a word, or `tokenize(text[, punctuation = puncRegex])`, where the second optional argument is a regex of items to remove (default is all punctuation).

### Porter2

The newer, revised version of `Porter`. It has exactly the same interface as `Porter` for stemming and tokenizing.
