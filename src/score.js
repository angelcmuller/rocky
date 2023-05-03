export function ScoringSystem(Distance, Pins, Comments) {

    // Calculate existing pins
    let scorePins = 0;
    for (let i = 0; i < Pins.length; i++) {
      if (Pins[i].Classification === 'bump') {
        scorePins += 3;
        }
      if (Pins[i].Classification === 'crack') {
        scorePins += 4;
      }
      if (Pins[i].Classification === 'pot hole') {
        scorePins += 5;
      }
      if (Pins[i].Classification === 'speed bump') {
        scorePins += 2;
      }
    }
  
    // Calculate existing comments
    let scoreComments = 0;
    for (let i = 0; i < Comments.length; i++) {
      const trustworthiness = Comments[i].Likes / (Comments[i].Likes + Comments[i].Dislikes);
      scoreComments += Comments[i].Option * trustworthiness;
    }
  
    let totalScore = (scorePins + scoreComments);
    let hazardDensity =  totalScore / Distance;
    
    return {totalScore, hazardDensity};
  }


  
//   Potential functoin is more time is avaliable 


//   function computeSafestRoutes(distances, scores) {
//     // Find the index of the route with the lowest score
//     let lowestScoreIndex = 0;
//     let lowestScore = scores[0];
//     for (let i = 1; i < scores.length; i++) {
//       if (scores[i] < lowestScore) {
//         lowestScore = scores[i];
//         lowestScoreIndex = i;
//       }
//     }
  
//     // Compute the safety score for each route
//     let safetyScores = [];
//     for (let i = 0; i < routes.length; i++) {
//       let safetyScore = scores[i] - lowestScore + distances[i];
//       safetyScores.push(safetyScore);
//     }
  
//     // Sort the routes by their safety score
//     let rankedRoutes = [];
//     for (let i = 0; i < routes.length; i++) {
//       rankedRoutes.push({
//         route: routes[i],
//         score: Math.round((1 - (safetyScores[i] / Math.max(...safetyScores))) * 100)
//       });
//     }
//     rankedRoutes.sort((a, b) => b.score - a.score);
  
//     return rankedRoutes;
//   }
  




  