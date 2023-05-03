//Author: Tristan Bailey
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

  //Author: Tristan Bailey
export function count_classifications(object_array, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked) {
    // Create an object to store the count of each classification without spaces
    const counts = {
      'other': 0,
      'pothole': 0,
      'crack': 0,
      'speedbump': 0,
      'bump': 0
    };
  
    // Iterate through the object array
    object_array.forEach((obj) => {
      // Check if the object has the desired Classification values based on the given boolean flags
      const hasOther = isOtherChecked && obj.Classification === 'other';
      const hasPothole = isPotholeChecked && (obj.Classification === 'pot hole' || obj.Classification === 'pothole');
      const hasCrack = isCrackChecked && obj.Classification === 'crack';
      const hasSpeedBump = isSpeedBumpChecked && obj.Classification === 'speed bump';
      const hasBump = isBumpChecked && obj.Classification === 'bump';
  
      // Check if all desired Classification values are matched and increment the count of the corresponding classification
      if (hasOther || hasPothole || hasCrack || hasSpeedBump || hasBump) {
        counts[obj.Classification.replace(/\s+/g, '')]++;
      }
    });
  
    // Return the counts object
    return counts;
  }
  