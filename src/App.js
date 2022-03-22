import React, { useState } from 'react';

import './App.css';
import NrmMapGenCanvas from "./components/norm_map_generator"

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"


function App() {

  //States
  const [isImageLoaded, setIsImageLoaded] = useState(false) //State to tell if an img is loaded or not.

  const download_image = function(){
      var canvas = document.getElementById("normal-canvas");
      var anchor = document.createElement("a");
      anchor.href = canvas.toDataURL("image/png");
      anchor.download = "NormalMap.png";
      anchor.click();
  };

  return (
    
    <div className="App">
      
      <header className="App-header">

      <h1>Normal Map Generator</h1>
      <p style={{textAlign:'center'}}></p>

        <div>
          
          <p><NrmMapGenCanvas isImageLoaded={setIsImageLoaded}></NrmMapGenCanvas>
          <button style={{color: 'white'}} id="download-button" onClick={download_image}>Download Image</button></p>    
        </div>
      </header>
    </div>
  );  
}

export default App;
