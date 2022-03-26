import React from 'react';
import './App.css';
import UploadImages from './UploadImages';
import styled from 'styled-components';
import Slider from './Slider';

const Styles = styled.div`

`;


function App() {
  return (
    <Styles>
    <div className="App">
      <header className="App-header">
        <p>
          <UploadImages></UploadImages>
          <div className="Slider">
            <Slider></Slider>
            <Slider></Slider>
            <Slider></Slider>
            <Slider></Slider>
          </div>
        </p>
      </header>
    </div>
    </Styles>
  );
}

export default App;
