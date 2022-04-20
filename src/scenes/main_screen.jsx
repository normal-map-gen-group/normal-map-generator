import React, { useRef, useState} from 'react';

import '../css/App.css';
import '../css/main_screen.css';
import '../css/button.css';
import NrmMapGenCanvas from "../components/norm_map_generator";
import DownloadButton from '../components/download_button';
import UploadButton from '../components/upload_button';


//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function MainScreen (props){

  function handleSceneChange(e) {
    props.onSceneChange();
  }

  const generatorRef = useRef()
  const [isImageLoaded, setIsImageLoaded] = useState(0) 

  //Triggers a high resolution render on the high res canvas.
  const renderHighRes = () => {
    generatorRef.current.isRenderHighRes.current = true;
    generatorRef.current.GenerateNormalMap()
    generatorRef.current.isRenderHighRes.current = false;
    generatorRef.current.GenerateNormalMap()
  }

  function show() {
    return props.activeScene === "MainScreen";
  }

  if (show()) {
    return (

      <div className="App">

        <header className="header">
        <div id="title">Normal Map Generator</div>
        
        <div class = "grid_items">
          <div class = "grid_item">
            The normal map preview goes here
          </div>

          <div class = "grid_item">
            <NrmMapGenCanvas baseImage={props.baseImage} setImageLoaded={setIsImageLoaded} ref={generatorRef}></NrmMapGenCanvas>
          </div>

          <div class = "grid_item">
            The 3D preview goes here
          </div>

        </div>

        </header>

        <div className="BtnBtm">
            <DownloadButton renderHighRes={renderHighRes}></DownloadButton>
        </div> 
      </div>
    );
  } else {
    return null;
  }
}

export default MainScreen;