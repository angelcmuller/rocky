export function displayPanel(counts, map) {
    // Create a div element for the panel
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = '10px';
    panel.style.right = '50px';
    panel.style.backgroundColor = 'white';
    panel.style.padding = '10px';
    panel.style.border = '1px solid black';
    panel.style.borderRadius = '5px';
    panel.style.backgroundColor = '#F4ECC2';
    panel.style.color = 'Black';
    panel.style.height='30%';
    panel.style.width='20%';
    panel.style.textAlign = "center";
    

    // Create a heading for the panel
    const heading = document.createElement("h2");
    heading.innerText = "Route Information Summary";
    panel.appendChild(heading);

  // Create a list element to display counts
  const countsList = document.createElement("ul");

  // Loop through the counts object and create a list item for each count
  for (const key in counts) {
    if (counts.hasOwnProperty(key)) {
      const listItem = document.createElement("li");
      listItem.innerText = `${key[0].toUpperCase() + key.slice(1)}: ${counts[key]}`;
      countsList.appendChild(listItem);
    }
  }

  // Append the countsList to the panel
  panel.appendChild(countsList);

  // Add the panel to the map container
  map.getContainer().appendChild(panel);
}