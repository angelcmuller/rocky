import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter as Router} from 'react-router-dom';

const rootElement = document.getElementById('root')

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <ChakraProvider>
      <App />
    </ChakraProvider>
    </Router>
  </React.StrictMode>, 
  rootElement
)