import React from 'react';
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
import Homepage from './Homepage.js'
import { useRef, useState, useMemo} from 'react'
import styled from 'styled-components';
import { motion } from 'framer-motion';
import car from './images/car.svg';
import mountain from './images/mountain.svg';
import logo from './images/logo1.png';



function App() {
  const [mapisShown, setmapIsShown] = useState(false);
  const [homepageShown, sethomepageisShown] = useState(true);
  const showMap= event => {
    // 👇️ toggle shown state
    setmapIsShown(current => !current);
    sethomepageisShown(current => !current);
  };
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(true)
  const navigatetoMap = () =>{
    setShowResults(current => !current);
    navigate('/Map')
  }
  const fadeLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  };
  
  const Section = styled.section`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  padding: 3rem calc((100vw - 1300px) / 2);
  @media screen and (max-width: 768px) {
    grid-grid-template-columns: 1fr;
  }
`;

const ColumnLeft = styled.div`
  display: flex;
  color: #000;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem .5rem;
  
  h1 {
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }
  p {
    margin: 2rem 0;
    font-size: 1rem;
    line-height: 1.1;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 3rem;
  font-size: 1rem;
  border: 2px solid #000;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  background: transparent;
  color: #000;
`;

const Image = styled(motion.img)`
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 250px;
  max-height: 250px;
`;

const ColumnRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  ${Image}:nth-child(1) {
    top: 250px;
    left: 50px;
    height: 1000px;
    width: 1000px;
  }
  ${Image}:nth-child(2) {
    height: 100px;
    width: 100px;
    top: 350px;
    right: 10px;
  }
  ${Image}:nth-child(3) {
    height: 100px;
    width: 100px;
    top: 350px;
    right: 10px;
  }
`;

  return (
    <div>
      {showResults &&(
    <div>

    <Section>
      <Container>
      <Image
            src={logo}
            alt='planet'
            scale =  {0.1}
          />
        <ColumnLeft>
        
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Rocky Road Project
          </motion.h1>
          <motion.p
            variants={fadeLeft}
            initial='hidden'
            animate='visible'
            transition={{ duration: 1 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </motion.p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{
              scale: 0.95,
              backgroundColor: '#000',
              border: 'none',
              color: '#FFF'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.5 } }}
            onClick = {navigatetoMap}
          >
            Start your journey
          </Button>
        </ColumnLeft>
        <ColumnRight>
          <Image
            src={mountain}
            color = 'white'
            alt='planet'
            whileTap={{ scale: 0.9 }}
            drag={true}
            dragConstraints={{ left: 0, right: 250, top: 0, bottom: 50 }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
          />
          <Image
            src={car}
            alt='planet'
            drag={true}
            dragConstraints={{ left: 100, right: 0, top: 0, bottom: 50 }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
          />
        </ColumnRight>
      </Container>
    </Section>
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