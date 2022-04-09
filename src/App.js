import React, { useRef, useState} from 'react';

import './css/App.css';
import NrmMapGenCanvas from "./components/norm_map_generator"
import DownloadButton from './components/download_button';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function App() {
  
  const generatorRef = useRef()
  const [isImageLoaded, setIsImageLoaded] = useState(0) 

  //Triggers a high resolution render on the high res canvas.
  const renderHighRes = () => {
    generatorRef.current.isRenderHighRes.current = true;
    generatorRef.current.GenerateNormalMap()
    generatorRef.current.isRenderHighRes.current = false;
    generatorRef.current.GenerateNormalMap()
  }

  return (
    
    <div className="App">
      
      <header className="App-header">
        <div>
          <NrmMapGenCanvas setImageLoaded={setIsImageLoaded} ref={generatorRef}></NrmMapGenCanvas>
          <DownloadButton renderHighRes={renderHighRes} isImageLoaded={isImageLoaded}></DownloadButton>
        </div>
      </header>
    </div>
  );  
}

export default App;
