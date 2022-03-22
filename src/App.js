import React, { useState } from 'react';

import './App.css';
import NrmMapGenCanvas from "./components/norm_map_generator"
import DownloadButton from './components/downloadButton';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"


function App() {

  //States
  const [isImageLoaded, setIsImageLoaded] = useState(false) //State to tell if an img is loaded or not.

  return (
    
    <div className="App">
      
      <header className="App-header">

      <h1>Normal Map Generator</h1>
      <p style={{textAlign:'center'}}></p>

        <div>
          <p><NrmMapGenCanvas isImageLoaded={setIsImageLoaded}></NrmMapGenCanvas>
          <DownloadButton></DownloadButton></p>
        </div>
      </header>
    </div>
  );  
}

export default App;
