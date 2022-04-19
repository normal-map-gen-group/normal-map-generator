import React from 'react';

import '../css/upload_button.css';

const UploadButton = (props) => {

  return (
    <label className="waves-effect waves-light btn-large" id="upload-button-container">
      <input style={{ color: props.color }} id="upload-button" type="file" accept="image/*" onChange={props.changeFunc} />
      Upload Texture
    </label>
  )
};

export default UploadButton