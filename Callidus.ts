//////////////
// Classify ///////////////////////////////////////////////////////////////////////////////////////
//////////////

// distance algorithms
import KNearestNeighbors from "./classify/distance-algorithms/KNN";
import NearestCentroid from "./classify/distance-algorithms/NearestCentroid";

// weights
import Perceptron from "./classify/weights/Perceptron";

// naive bayes
import Bernoulli from "./classify/naive-bayes/BernoulliNaiveBayes";
import Multinomial from "./classify/naive-bayes/MultinomialNaiveBayes";

// rules
import ZeroR from "./classify/rules/ZeroR";
import OneR from "./classify/rules/OneR";

// trees and boosting
/* don't import these yet they aren't done */

/////////////
// Regress ////////////////////////////////////////////////////////////////////////////////////////
/////////////

import Linear from "./regress/LinearRegression";
import ExponentialE from "./regress/EExponentialRegression";
import ExponentialAB from "./regress/ABExponentialRegression";
import Logarithmic from "./regress/LogarithmicRegression";
import Power from "./regress/PowerRegression";
import Inverse from "./regress/InverseRegression";
import Quadratic from "./regress/QuadraticRegression";
import Polynomial from "./regress/PolynomialRegression";

/////////////
// Cluster ////////////////////////////////////////////////////////////////////////////////////////
/////////////

import KMeans from "./cluster/KMeansClustering";
import KMedians from "./cluster/KMediansClustering";

///////////
// Tools //////////////////////////////////////////////////////////////////////////////////////////
///////////

import Porter from "./tools/PorterStemmer";
import Porter2 from "./tools/Porter2Stemmer";

/////////////
// exports ////////////////////////////////////////////////////////////////////////////////////////
/////////////

var Classify = {
    Distance: {
        KNearestNeighbors,
        NearestCentroid
    },
    Weights: {
        Perceptron
    },
    NaiveBayes: {
        Bernoulli,
        Multinomial,
    },
    Rules: {
        ZeroR,
        OneR
    }
};

var Regress = {
    Linear,
    ExponentialE,
    ExponentialAB,
    Logarithmic,
    Power,
    Inverse,
    Quadratic,
    Polynomial
};

var Cluster = {
    KMeans,
    KMedians
};

var Tools = {
    Porter,
    Porter2
};

export {
    Classify,
    Regress,
    Cluster,
    Tools
};