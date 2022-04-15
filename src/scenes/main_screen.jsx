import React, { useRef, useState} from 'react';

import '../css/App.css';
import '../css/main_screen.css';
import NrmMapGenCanvas from "../components/norm_map_generator";
import DownloadButton from '../components/download_button';
import MainUploadButton from '../components/main_upload_button';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function MainScreen (props){

  function handleSceneChange(e) {
    props.onSceneChange("SplashScreen");
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
        <div class = "App-headerTop">
            <div id = "main-title">Normal Map Generator</div>
            
            <div class = "mainContainer">
            <NrmMapGenCanvas setImageLoaded={setIsImageLoaded} ref={generatorRef}></NrmMapGenCanvas>
            </div>
            <div class="downloadBtnBtm"><DownloadButton renderHighRes={renderHighRes} isImageLoaded={isImageLoaded}></DownloadButton></div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default MainScreen;