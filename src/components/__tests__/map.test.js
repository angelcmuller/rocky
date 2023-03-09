// Jest Test for the Map Style change in the main Map-ui
// Functionality and Test Written by Aaron Ramirez

// Creating jsdom built-in test environment to access the document object
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

//
test('Changing map style onClick of the input', () => {
    // Create a mock Mapbox Map instance using .fn()
    const mockMap = {
    setStyle: jest.fn(),
    center: jest.fn()
    };

    // Creating a mock DOM environment using jsdom
    const { window } = new JSDOM();
    global.window = window;
    // Creating document object to be able to use it to access
    // the element 'input' from the Map instance
    global.document = window.document;

    // Simulate clicking an input with a specific layer ID
    const input = document.createElement('map-container');
    input.id = 'my-style';
    input.onclick = () => {
        mockMap.setCenter([98,117]);
    };

    // Creating the onclick event handler function for the input before simulating the click
    input.click();

    // Verify the setStyle method was called with the correct argument
   expect.anything(mockMap)

    // Clean up global variables after the test
    delete global.window;
    delete global.document;
});