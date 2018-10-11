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

orderPop=function(a , b){
    if(a.fitness > b.fitness){
        return 1
    }
    if(a.fitness < b.fitness){
        return -1
    }
    return 0
}

PMX=function(ChromosomeA, ChromosomeB){

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

swap_mutation=function(offspring, mutationRate,chromosomeSize){
  nqueens=chromosomeSize
    for (let i = 0; i < offspring.length; i++) {

        if (Math.random() < mutationRate) {

            let x = Math.floor(Math.random() * nqueens)
            let y = Math.floor(Math.random() * nqueens)

            if(x != y ){
                let aux = offspring[i].chromosome[x]
                offspring[i].chromosome[x] = offspring[i].chromosome[y]
                offspring[i].chromosome[y] = aux

                offspring[i].evaluate
            }

        }

    }
    return offspring
}


tournamentK=function(population, populationSize, k){

    // console.log(populationSize);
    var listK = []
    for(var i=0;i<k;i++){
      listK.push(Math.floor(Math.random() * populationSize))
    }

    // console.log(listK);

    listK.sort(function(a,b){ return b - a  })
    return population[listK[0]]
}

performCrossOver=function(populationSize, ktournament, crossoverRate, population){
  offspring=[]
    while (offspring.length < populationSize) {
        let fatherA = tournamentK(population, populationSize, ktournament)
        let fatherB = tournamentK(population, populationSize, ktournament)
        // console.log(fatherA);

        if(Math.random() < crossoverRate){
            let sons = PMX(fatherA.chromosome, fatherB.chromosome)
            offspring.push(new Solution(sons[0]))
            offspring.push(new Solution(sons[1]))
        }else{
            offspring.push(new Solution(fatherA.chromosome))
            offspring.push(new Solution(fatherB.chromosome))
        }
    }
    return offspring

}

mergePop =function(offspring,population,populationSize){

    offspring.forEach(element => {population.push(new Solution(element.chromosome))
    });
    offspring = []
    // console.log(population);
    population.sort(orderPop)
    population.splice(populationSize)
    return population
}

function runOneGeneration() {
populationSize, k_tournament, crossoverRate, population

    offspring=performCrossOver()
  // crossover()
    // tournamentK()
    offspring=swap_mutation()
    offspring=mergePop()

    return offspring
}

module.exports = {
  genetic_algorithm: function (population, mutation_rate, crossover_rate, k_tournament) {
    current_population=[]
      // console.log(population)
      for (var i = 0; i < Object.keys(population).length; i++) {
        current_population.push(population[i])
      }

      // console.log(current_population[0].chromosome.length)

    // whatever
    population_size=current_population.length
    // console.log(current_population);

    chromosome_size=current_population[0].chromosome.length
    offspring=performCrossOver(population_size, k_tournament, crossover_rate, current_population)
    offspring=swap_mutation(offspring, mutation_rate,chromosome_size)
    offspring=mergePop(offspring,current_population, population_size)

    return offspring//new population
  }
};
