class Solution{

    constructor(chromosome) {
        this.chromosome = []
        chromosome.forEach(element => {
            this.chromosome.push(element)
        });
        this.evaluate()
    }

    evaluate(){
        this.fitness = evaluate(this.chromosome)
    }

}

class GA {

    constructor(populationSize, mutationRate, crossoverRate, max_generation, ktournament, nqueens){
        this.populationSize = populationSize
        this.mutationRate = mutationRate
        this.crossoverRate = crossoverRate
        this.max_generation = max_generation
        this.ktournament = ktournament

        this.nqueens = nqueens

        this.population = []
        this.offspring = []
    }

    initializePop(){
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(randomSolution(this.nqueens))
        }
    }


}

function orderPop(a,b){
    if(a.fitness > b.fitness){
        return 1
    }
    if(a.fitness < b.fitness){
        return -1
    }
    return 0
}

function randomSolution(nqueens){
    tempArray = Array.from({length: nqueens}, (v, i) => i)
    tempArray.shuffle()
    return new Solution(tempArray)
}

function evaluate(chromosome){
    let clashes = 0.0

    for (let i = 0; i < chromosome.length; i++){
        for (let j = 0; j < chromosome.length; j++){
            if (i != j){
                dx = Math.abs(i - j)
                dy = Math.abs(chromosome[i] - chromosome[j])
                if(dx == dy)
                    clashes += 1
            }
        }
    }

    return clashes
}

function runOneGeneration() {
      // console.log("clicou")
      // console.log(ga.population)
      $.post("/newPop", {
        pop:JSON.stringify(ga.population),
        mr: JSON.stringify(ga.mutationRate),
        cr: JSON.stringify(ga.crossoverRate),
        k: JSON.stringify(ga.ktournament)
    }, function(newPop) {
      newPop=JSON.parse(newPop)
      // console.log(newPop)
          ga.population=newPop;
          ga.population.sort(orderPop)

          countGen++
      });


    // ga.performCrossOver()
    // ga.mutation()
    // ga.mergePop()



    if (countGen >= ga.max_generation || ga.population[0].fitness == 0)
        stopFunction()

    // requires plot.js script to plot solution in the chessboard
    printChessBoard();
    plotSolution(ga.population[0].chromosome)

    let html = "last gen: " + countGen + " | Number of clashes: " + ga.population[0].fitness

    $("#log").html(html);

}

function stopFunction() {
    clearInterval(runningVar)
}

//Customized function to add the shuffle capacity on protopyte Array
Array.prototype.shuffle = function() {
    var input = this

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1))
        var itemAtIndex = input[randomIndex]

        input[randomIndex] = input[i]
        input[i] = itemAtIndex
    }
    return input
}

// Global vars
let ga
let countGen = 1
let runningVar

function solve(){

    // preparing the environment
    stopFunction();
    printChessBoard();

    // load information from page
    let pop = $('#population_size').val()
    let mut = $('#mutation_rate').val()
    let cx = $('#crossover_rate').val()
    let maxg = $('#max_generations').val()
    // let delay = $('#delay').val()
    delay=2000
    let ktournament = $('#k_tournament').val()
    let nqueens = $('#nqueens').val()

    if(!pop)
        pop = 100
    if(!mut)
        mut = 0.05
    if(!cx)
        cx = 0.8
    if(!maxg)
        maxg = 200;
    if(!ktournament)
        ktournament = 3
    if(!delay)
        delay = 100
    if(!nqueens)
        nqueens = 8

    //create and initialize the Genetic Algorithm
    ga = new GA(pop, mut, cx, maxg, ktournament, nqueens)
    countGen = 0

    ga.initializePop()

    // Main loop running with setInvertal function
    runningVar = setInterval(function(){ runOneGeneration() }, delay)

}
