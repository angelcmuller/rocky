export function displayPanel(counts, map, lastPanelTop) {
  // Extract the route_id from the counts object
  const routeId = counts.route_id;
  
  // Create a div element for the panel
  const panel = document.createElement('div');
  panel.style.position = 'absolute';
  panel.style.top = `${lastPanelTop}px`; 
  panel.style.right = '50px';
  panel.style.backgroundColor = 'white';
  panel.style.padding = '10px';
  panel.style.border = '1px solid black';
  panel.style.borderRadius = '5px';
  panel.style.backgroundColor = 'white';
  panel.style.color = 'black';
  panel.style.width='fit-content';
  
  // Create a heading for the panel
  const heading = document.createElement("h2");
  heading.innerText = `Route ${routeId + 1} Summary`;
  heading.style.fontSize = '24px';
  heading.style.lineHeight = '1.25';
  heading.style.textDecoration = 'underline';
  panel.appendChild(heading);

  // Add a horizontal line separator
  const separator = document.createElement('hr');
  separator.style.marginTop = '5px';
  separator.style.marginBottom = '10px';
  separator.style.borderTop = '1px solid black';
  panel.appendChild(separator);

  // Create a list element to display non-score counts
  const countsList = document.createElement("ul");
  countsList.style.paddingLeft = '20px'; // Add padding to the left side

  // Loop through the counts object and create a list item for each non-score count
  for (const key in counts) {
    if (key !== 'route_id' && !['score', 'approval_rating', 'hazard_ratio'].includes(key) && counts.hasOwnProperty(key)) {
      const listItem = document.createElement("li");
      listItem.innerText = `${key[0].toUpperCase() + key.slice(1)}: ${counts[key]}`;
      listItem.style.fontSize = '16px';
      listItem.style.lineHeight = '1.5';
      countsList.appendChild(listItem);
    }
  }

  // Append the non-score countsList to the panel
  panel.appendChild(countsList);

  // Add a horizontal line separator between the non-score counts and the score counts
  const scoreSeparator = document.createElement('hr');
  scoreSeparator.style.marginTop = '10px';
  scoreSeparator.style.marginBottom = '10px';
  scoreSeparator.style.borderTop = '1px solid black';
  panel.appendChild(scoreSeparator);

  // Create a list element to display score counts
  const scoreList = document.createElement("ul");
  scoreList.style.paddingLeft = '20px'; // Add padding to the left side

  // Loop through the counts object and create a list item for each score count
  for (const key of ['score', 'approval_rating', 'hazard_ratio']) {
    const listItem = document.createElement("li");
    let value = counts[key];
    if (key === 'approval_rating') {
      value = `${(value * 100).toFixed(3)}%`; // Convert to percentage with 3 decimal places
    } else if (key === 'hazard_ratio') {
      value = value.toFixed(10); // Limit to 10 decimal places
    }
    listItem.innerText = `${key[0].toUpperCase() + key.slice(1)}: ${value}`;
    listItem.style.fontSize = '16px';
    listItem.style.lineHeight = '1.5';
    scoreList.appendChild(listItem);
  }

  // Append the scoreList to the panel
  panel.appendChild(scoreList);

  // Add padding to the top of the panel to fill the


// Add padding to the top of the panel to fill the background
panel.style.paddingTop = '10px';
panel.style.paddingBottom = '10px';




  // Add the panel to the map container
  map.getContainer().appendChild(panel);

  // Update the top position of the panel to create space between panels
  const panelSpacing = 10;
  const panelHeight = panel.offsetHeight + panelSpacing;

  return panelHeight;
}