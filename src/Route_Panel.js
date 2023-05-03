export function displayPanel(message, map) {
    // Create a div element for the panel
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = '10px';
    panel.style.right = '50px';
    panel.style.backgroundColor = 'white';
    panel.style.padding = '10px';
    panel.style.border = '1px solid black';
    panel.style.borderRadius = '5px';

    // Create a heading for the panel
    const heading = document.createElement('h3');
    heading.innerText = 'Route Information';
    panel.appendChild(heading);

    // Create a paragraph for the message
    const messagePara = document.createElement('p');
    messagePara.innerText = message;
    panel.appendChild(messagePara);

    // Add the panel to the map container
    map.getContainer().appendChild(panel);
}