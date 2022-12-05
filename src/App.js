import React from 'react'
import {
  BrowserRouter as Router, 
  Switch,
  Route,
  Navigate,
  useNavigate,
  Routes
} from 'react-router-dom'
import Map from './Map.js'
import './App.css';

function App() {
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(true)
  const navigatetoMap = () =>{
    setShowResults(current => !current);
    navigate('/Map')
  }
  return (
    
    <div>
      {showResults &&(
    <div>
    {
    //put landing page here 
    }
      <button onClick = {navigatetoMap}>Enter</button>
    </div>
      )}
    <div>
    <Routes>
    <Route path="/Map" element={<Map/>} />
    </Routes></div>
    </div>
  );
}

export default App;