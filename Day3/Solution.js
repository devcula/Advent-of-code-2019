var fs = require('fs');

class Line{
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class Wire{
    constructor(wirePath){
        let lines = extractLines(wirePath);
        this.horizontalLines = lines.horizontalLines;
        this.verticalLines = lines.verticalLines;
    }
}

const extractLines = (wirePath) => {
    horizontalLines = [];
    verticalLines = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < wirePath.length; i++) {
        let line;
        let newX, newY;
        switch (wirePath[i].substring(0, 1)) {
            case 'U':
                newY = y + Number(wirePath[i].substring(1));
                line = new Line(x, y, x, newY);
                verticalLines.push(line);
                y = newY;
                break;
            case 'D':
                newY = y - Number(wirePath[i].substring(1));
                line = new Line(x, y, x, newY);
                verticalLines.push(line);
                y = newY;
                break;
            case 'L':
                newX = x - Number(wirePath[i].substring(1));
                line = new Line(x, y, newX, y);
                horizontalLines.push(line);
                x = newX;
                break;
            case 'R':
                newX = x + Number(wirePath[i].substring(1));
                line = new Line(x, y, newX, y);
                horizontalLines.push(line);
                x = newX;
                break;
        }
    }
    return {
        "horizontalLines": horizontalLines,
        "verticalLines": verticalLines
    }
}

const findIntersection = (horizontalLine, verticalLine) => {
    let possibleIntersection = {
        "x": verticalLine.x1,
        "y": horizontalLine.y1
    }
    let xLiesInBetween = false;
    let yLiesInBetween = false;
    if(horizontalLine.x1 > horizontalLine.x2){
        if(possibleIntersection.x >= horizontalLine.x2 && possibleIntersection.x <= horizontalLine.x1){
            xLiesInBetween = true;
        }
    }
    else{
        if(possibleIntersection.x >= horizontalLine.x1 && possibleIntersection.x <= horizontalLine.x2){
            xLiesInBetween = true;
        }
    }
    if(verticalLine.y1 > verticalLine.y2){
        if(possibleIntersection.y >= verticalLine.y2 && possibleIntersection.y <= verticalLine.y1){
            yLiesInBetween = true;
        }
    }
    else{
        if(possibleIntersection.y >= verticalLine.y1 && possibleIntersection.y <= verticalLine.y2){
            yLiesInBetween = true;
        }
    }
    if(xLiesInBetween && yLiesInBetween){
        if(possibleIntersection.x != 0 || possibleIntersection.y != 0){
            return possibleIntersection;
        }
        else{
            return null;
        }
    }
    else{
        return null;
    }
}

const findStepCount = (intersection, wirePath) => {
    let x = 0, y = 0, stepCount = 0;
    for(let i = 0; i < wirePath.length; i++){
        let newX, newY;
        switch (wirePath[i].substring(0, 1)) {
            case 'U':
                newY = Number(wirePath[i].substring(1));
                if(x == intersection.x){
                    if(intersection.y > y){
                        let lenRequired = intersection.y - y;
                        if(newY >= lenRequired){
                            stepCount += lenRequired;
                            return stepCount;
                        }
                    }
                }
                y += newY;
                stepCount += newY;
                break;
            case 'D':
                newY = Number(wirePath[i].substring(1));
                if(x == intersection.x){
                    if(intersection.y < y){
                        let lenRequired = y - intersection.y;
                        if(newY >= lenRequired){
                            stepCount += lenRequired;
                            return stepCount;
                        }
                    }
                }
                y -= newY;
                stepCount += newY;
                break;
            case 'L':
                newX = Number(wirePath[i].substring(1));
                if(y == intersection.y){
                    if(intersection.x < x){
                        let lenRequired = x - intersection.x;
                        if(newX >= lenRequired){
                            stepCount += lenRequired;
                            return stepCount;
                        }
                    }
                }
                x -= newX;
                stepCount += newX;
                break;
            case 'R':
                newX = Number(wirePath[i].substring(1));
                if(y == intersection.y){
                    if(intersection.x > x){
                        let lenRequired = intersection.x - x;
                        if(newX >= lenRequired){
                            stepCount += lenRequired;
                            return stepCount;
                        }
                    }
                }
                x += newX;
                stepCount += newX;
                break;
        }
        if(x == intersection.x && y == intersection.y){
            break;
        }
    }
    return stepCount;
}

fs.readFile('input.txt', (err, data) => {
    if(err){
        console.log(err);
    }
    else{
        let combinedData = data.toString().split("\n");
        let firstWirePath = combinedData[0].split(',');
        let secondWirePath = combinedData[1].split(',');
        let wire1 = new Wire(firstWirePath);
        let wire2 = new Wire(secondWirePath);
        let intersections = [];
        for(let vlIndex = 0; vlIndex < wire2.verticalLines.length; vlIndex++){
            verticalLine = wire2.verticalLines[vlIndex];
            for(let hlIndex = 0; hlIndex < wire1.horizontalLines.length; hlIndex++){
                horizontalLine = wire1.horizontalLines[hlIndex];
                let intersection = findIntersection(horizontalLine, verticalLine);
                if(intersection){
                    intersections.push(intersection);
                }
            }
        }
        for(let vlIndex = 0; vlIndex < wire1.verticalLines.length; vlIndex++){
            verticalLine = wire1.verticalLines[vlIndex];
            for(let hlIndex = 0; hlIndex < wire2.horizontalLines.length; hlIndex++){
                horizontalLine = wire2.horizontalLines[hlIndex];
                let intersection = findIntersection(horizontalLine, verticalLine);
                if(intersection){
                    intersections.push(intersection);
                }
            }
        }
        let minimumDistance = Number.MAX_SAFE_INTEGER;
        for(let i = 0; i < intersections.length; i++){
            distance = Math.abs(intersections[i].x) + Math.abs(intersections[i].y);
            if(distance < minimumDistance){
                minimumDistance = distance;
            }
        }
        console.log(`Part 1 answer: ${minimumDistance}`);

        //Part 2 starts
        let minStepCount = Number.MAX_SAFE_INTEGER;
        for(let i = 0; i < intersections.length; i++){
            let intersection = intersections[i];
            let stepCount = findStepCount(intersection, firstWirePath) + findStepCount(intersection, secondWirePath);
            if(stepCount < minStepCount){
                minStepCount = stepCount;
            }
        }
        console.log(`Part 2 answer: ${minStepCount}`);
    }
})