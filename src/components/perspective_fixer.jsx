import React from 'react';

import '../css/perspective_fixer.css';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

function PerspectiveFixer (props){

  function handleSceneChange(e) {
    props.onSceneChange("MainScreen");
  }

  function show() {
    return props.activeScene === "PerspectiveFixer";
  }

  if (show()) {
    return (
      <div className="App">
        <header className="App-header">
          <div id="perspective-title">Normal Map Generator</div>
          <div id="perspective-fixer"></div>
          <div>
            <a className="waves-effect waves-light btn-large" id="splash-upload-button" onClick={handleSceneChange}>Continue</a>
          </div>
        </header>
      </div>
    );
  } else {
    return null;
  }
}

export default PerspectiveFixer;