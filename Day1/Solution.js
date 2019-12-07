var fs = require('fs');

const calcFuelRequirementForModule = (moduleMass) => {
    return Math.floor(Number(moduleMass)/3) - 2;
}

const calcAdditionalFuel = (fuelMass) => {
    let extraFuel = 0;
    while(calcFuelRequirementForModule(fuelMass) > 0){
        let fuelRequired = calcFuelRequirementForModule(fuelMass);
        extraFuel += fuelRequired;
        fuelMass = fuelRequired;
    }
    return extraFuel;
}

fs.readFile('input.txt', (err, data) => {
    if(err){
        console.log(`Error ${err}`);
    }
    else{
        const inputData = data.toString().split("\n");    
        let fuelRequiredForModules = 0;
        let totalExtraFuel = 0;
        for(let i = 0; i < inputData.length; i++){
            let fuelRequiredForModule = calcFuelRequirementForModule(inputData[i])
            fuelRequiredForModules += fuelRequiredForModule;
            totalExtraFuel += calcAdditionalFuel(fuelRequiredForModule);
        }
        console.log(`Part 1 answer: ${fuelRequiredForModules}`);
        
        console.log(`Part 2 answer: ${fuelRequiredForModules + totalExtraFuel }`);
    }
})


