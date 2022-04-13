import React from 'react';

import '../css/splash_upload_button.css';

const SplashUploadButton = (props) => {

  return (
      <a class="waves-effect waves-light btn-large" id="splash-upload-button" onClick= {() =>
                                this.props.handleSceneChange("MainScreen")}>Upload Image</a>
  )
};

export default SplashUploadButton