import React, { useRef, useState, useCallback } from 'react';
import Cropper from '../components/cropper/Cropper'
import '../css/perspective_fixer.css';


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

  if (show()) {
    return (
      <div className="App">
          <div id="perspective-title">Normal Map Generator</div>

          <Cropper
            ref={cropperRef}
            image={img}
            onChange={onChange}
            onDragStop={onDragStop}
            maxWidth={500 - 10}
          />
          <input
            type='file'
            key={inputKey}
            onChange={onImgSelection}
            accept='image/*'
          />
          <button onClick={doSomething}>Fix Perspective</button>

          <div>
            <a className="waves-effect waves-light btn-large" id="splash-upload-button" onClick={handleSceneChange}>Continue</a>
          </div>
      </div>
    );
  } else {
    return null;
  }
}

export default PerspectiveFixer;