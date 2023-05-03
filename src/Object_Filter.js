export function object_filter(object_array, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked){
    // Create a new array to hold the filtered objects
    const filtered_array = [];
  
    // Iterate through the object array
    object_array.forEach((obj) => {
        // Check if the object has the desired Classification values based on the given boolean flags
        var hasOther = false;
        if(isOtherChecked) {
            hasOther = obj.Classification === 'other';
        } 
        var hasPothole = false;
        if(isPotholeChecked){
            hasPothole = obj.Classification === 'pot hole' || obj.Classification === 'pothole';
        } 
        var hasCrack = false;
        if(isCrackChecked){
            hasCrack = obj.Classification === 'crack';
        }
        var hasSpeedBump = false;
        if (isSpeedBumpChecked){
            hasSpeedBump = obj.Classification === 'speed bump';
        }
        var hasBump = false;
        if(isBumpChecked){
            hasBump = obj.Classification === 'bump';
        }
  
      // Check if all desired Classification values are matched
        const isMatched = 
            hasOther ||
            hasPothole ||
            hasCrack ||
            hasSpeedBump ||
            hasBump;
      // Add the object to the filtered array if all Classification values match
      if (isMatched) {
        filtered_array.push(obj);
      }
    });
  
    // Return the filtered array
    return filtered_array;
  }
  