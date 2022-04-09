import React, { useState } from 'react';

import './css/App.css';
import NrmMapGenCanvas from "./components/norm_map_generator"
import DownloadButton from './components/download_button';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"


function App() {

 
  return (
    
    <div className="App">
      
      <header className="App-header">

        <div>
          <NrmMapGenCanvas></NrmMapGenCanvas>
        </div>
      </header>
    </div>
  );  
}

export default App;
