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

    performCrossOver(){
        while (this.offspring.length < this.populationSize) {
            let fatherA = this.tournamentK(this.ktournament)
            let fatherB = this.tournamentK(this.ktournament)

            if(Math.random() < this.crossoverRate){
                let sons = this.PMX(fatherA.chromosome, fatherB.chromosome)
                this.offspring.push(new Solution(sons[0]))
                this.offspring.push(new Solution(sons[1]))
            }else{
                this.offspring.push(new Solution(fatherA.chromosome))
                this.offspring.push(new Solution(fatherB.chromosome))
            }
        }

    }


    PMX(ChromosomeA, ChromosomeB){

        let ind1 = ChromosomeA.slice(); let ind2 = ChromosomeB.slice()
        let size = ind1.length
        let p1 = Array.from({length:size}, () => 0)
        let p2 = Array.from({length:size}, () => 0)

        //Initialize the position of each indices in the individuals
        for (let i = 0; i < size; i++){
            p1[ind1[i]] = i
            p2[ind2[i]] = i
        }

        // Choose crossover points
        let cxpoint1 = Math.floor(Math.random() * size)
        let cxpoint2 = Math.floor(Math.random() * (size - 1))

        if (cxpoint2 >= cxpoint1)
            cxpoint2 += 1
        else {
            let aux = cxpoint1
            cxpoint1 = cxpoint2
            cxpoint2 = aux

        }

        // Apply crossover between cx points
        for (let i = cxpoint1; i < cxpoint2; i++){
            let temp1 = ind1[i]
            let temp2 = ind2[i]

            ind1[i] = temp2
            ind1[p1[temp2]] = temp1

            ind2[i] = temp1
            ind2[p2[temp1]] = temp2

            let aux = p1[temp1]
            p1[temp1] = p1[temp2]
            p1[temp2] = aux;

            let aux2 = p2[temp1]
            p2[temp1] = p2[temp2]
            p2[temp2] = aux2
        }

        return [ind1, ind2]

    }

    // Simple swap mutation
    mutation(){
        for (let i = 0; i < this.offspring.length; i++) {

            if (Math.random() < this.mutationRate) {

                let x = Math.floor(Math.random() * this.nqueens)
                let y = Math.floor(Math.random() * this.nqueens)

                if(x != y ){
                    let aux = this.offspring[i].chromosome[x]
                    this.offspring[i].chromosome[x] = this.offspring[i].chromosome[y]
                    this.offspring[i].chromosome[y] = aux

                    this.offspring[i].evaluate
                }

            }

        }
    }

    tournamentK(k){

        let listK = Array.from({length: k}, () => Math.floor(Math.random() * this.populationSize))
        listK.sort(function(a,b){ return b - a  })

        return this.population[listK[0]]
    }

    mergePop(){
        this.offspring.forEach(element => {
            this.population.push(new Solution(element.chromosome))
        });
        this.offspring = []
        this.population.sort(orderPop)
        this.population.splice(this.populationSize)
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
      $.get("/newPop", {
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
    delay=1000
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
