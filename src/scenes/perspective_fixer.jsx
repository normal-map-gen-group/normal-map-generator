import React, { useRef, useState, useCallback } from 'react';
import Cropper from '../components/cropper/Cropper'
import '../css/perspective_fixer.css';
import UploadButton from '../components/upload_button';


//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function PerspectiveFixer (props){

  const [cropState, setCropState] = useState()
  const [img, setImg] = useState()
  const [inputKey, setInputKey] = useState(0)
  const cropperRef = useRef()

  const onDragStop = useCallback((s) => setCropState(s), [])
  const onChange = useCallback((s) => setCropState(s), [])

  const doSomething = async () => {
    console.log(cropState)
    try {
      const res = await cropperRef.current.done({ preview: true })
      console.log(res)
      handleSceneChange()
    } catch (e) {
      console.log('error', e)
    }
  }

  const onImgSelection = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // it can also be a http or base64 string for example
      setImg(e.target.files[0])
    }
  }

  function handleSceneChange(e) {
    props.onSceneChange("MainScreen");
  }

  function show() {
    return props.activeScene === "PerspectiveFixer";
  }

  const image = new Image()

  if (show()) {
    return (
      <div className="App">
          <header className='perspective-header'>
            <div id="perspective-title">Normal Map Generator</div>
            <div class='centered'>
              <Cropper
                ref={cropperRef}
                image={img}
                onChange={onChange}
                onDragStop={onDragStop}
                maxWidth={500}
              />
            </div>
          
            <UploadButton id='cropper' color="white" changeFunc={onImgSelection} />

            <a className="waves-effect waves-light btn-large" id="splash-upload-button" onClick={doSomething}>Continue</a> 
          </header>                   
      </div>
    );
  } else {
    return null;
  }
}

export default PerspectiveFixer;