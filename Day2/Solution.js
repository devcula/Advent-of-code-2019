var fs = require('fs');

const calcOutput = (inputVals) => {
    let insPointer = 0;
    // console.log(inputVals);
    while(Number(inputVals[insPointer]) != 99 && insPointer < inputVals.length){
        switch(Number(inputVals[insPointer])){
            case 1:
                inputVals[inputVals[insPointer + 3]] = Number(inputVals[inputVals[insPointer + 1]]) + Number(inputVals[inputVals[insPointer + 2]]);
                insPointer += 4;
                break;
            case 2:
                inputVals[inputVals[insPointer + 3]] = Number(inputVals[inputVals[insPointer + 1]]) * Number(inputVals[inputVals[insPointer + 2]]);
                insPointer += 4;
                break;
            default:
                break;
        }
    }
    // console.log(inputVals[0]);
    return inputVals[0];
}

fs.readFile('input.txt', (err, data) => {
    if(err){
        console.log(`Error: ${err}`);
    }
    else{
        let input = data.toString().split(',');
        let inputVals = input.slice();
        inputVals[1] = '12';
        inputVals[2] = '2';
        console.log(`Part 1 answer: ${calcOutput(inputVals)}`);
        for(let noun = 0; noun <= 99; noun++){
            let found = false;
            for(let verb = 0; verb <= 99; verb++){
                let memory = input.slice();
                memory[1] = noun;
                memory[2] = verb;
                if(calcOutput(memory) == 19690720){
                    console.log(`Part 2 answer: ${100 * noun + verb}`);
                    found = true;
                    break;
                }
            }
            if(found){
                break;
            }
        }
    }
})