//Author: gabriel Mortenson
export function ScoringSystem(Distance, Pins, Comments) {

    // Calculate existing pins
    let scorePins = 0;

    if(Pins.length > 0){
        for (let i = 0; i < Pins.length; i++) {
        if (Pins[i].Classification === 'bump') {
            scorePins += 0.3;
            }
        if (Pins[i].Classification === 'crack') {
            scorePins += 0.2;
        }
        if (Pins[i].Classification === 'pot hole') {
            scorePins += 0.5;
        }
        if (Pins[i].Classification === 'speed bump') {
            scorePins += 0.3;
        }
        }
    }

    // Calculate existing comments
    let scoreComments = 0;

    if(Comments.length > 0){
        for (let i = 0; i < Comments.length; i++) {
        const trustworthiness = (Comments[i].Likes + 1) / (Comments[i].Likes + Comments[i].Dislikes + 2);
    
            if (Comments[i].Classification === 'bump') {
                scoreComments += 0.3 *  trustworthiness * 0.5 * Comments[i].Option;
                }
            if (Comments[i].Classification === 'crack') {
                scoreComments += 0.2 * trustworthiness * 0.5 * Comments[i].Option;
            }
            if (Comments[i].Classification === 'pot hole') {
                scoreComments += 0.5 * trustworthiness * 0.5 * Comments[i].Option;
            }
            if (Comments[i].Classification === 'speed bump') {
                scoreComments += 0.2 * trustworthiness * 0.5 * Comments[i].Option;
            }
        }
    }

    let totalScore = (scorePins + scoreComments);

    // Routes that don't require driving are safe
    const hazardDensity =  (totalScore + 1) / (Distance + 1);

    
    console.log("Score : " + totalScore);
    console.log("Ratio : " + hazardDensity);
    
    

    // Set a cap for the totalScore 
    if (totalScore < 100){
      
        return  [100 - totalScore, hazardDensity];
    }
    else{
        const score = 100;
        return  [100 - score, hazardDensity];
    }
  }