import React, { useRef, useState, useCallback, useEffect } from 'react';
import Cropper from '../components/cropper/Cropper'
import '../css/perspective_fixer.css';


//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"
function PerspectiveFixer (props){

  const [cropState, setCropState] = useState()
  const [getImage, setGetImage] = useState(false)
  const cropperRef = useRef()

  const onDragStop = useCallback((s) => setCropState(s), [])
  const onChange = useCallback((s) => setCropState(s), [])

  function setBaseImage(image) {
    props.onSetBaseImage(image);
  }

  const doSomething = async () => {
    console.log(cropState)
    try {
      const res = await cropperRef.current.done({ preview: true })
      console.log(res)
      props.baseImage.src = document.getElementById("perspective-fixer").toDataURL();
      setBaseImage(props.baseImage);
    } catch (e) {
      console.log('error', e)
    }
  }

  function goBack() {
    props.onGoBack("SplashScreen");
  }
  
  function handleSceneChange() {
    setBaseImage(props.baseImage);
    props.onSceneChange("MainScreen");
  }

  function show() {
    return props.activeScene === "PerspectiveFixer";
  }

  if (show()) {
    return (
      <div className="App">
      <button className="waves-effect waves-light btn-large back-button" onClick={goBack}><i className="material-icons">arrow_back</i></button>
          <header className='perspective-header'>
            <div id="perspective-title">Normal Map Generator</div>
            <div className='centered'>
              <Cropper
                ref={cropperRef}
                image={props.baseImage.src}
                onChange={onChange}
                onDragStop={onDragStop}
                maxWidth={500}
              />
            </div>
          <div className="continueBtnBtm">
            <button className="waves-effect waves-light btn-large continue" onClick={doSomething}>Crop</button>
            <button className="waves-effect waves-light btn-large continue" onClick={handleSceneChange}>Continue</button>
          </div> 
          </header>                   
      </div>
    );
  } else {
    return null;
  }
}

export default PerspectiveFixer;