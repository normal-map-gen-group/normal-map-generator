import React from 'react';

import '../css/upload_button.css';

const UploadButton = (props) => {

  return (
    <div>
      Upload Image:
      <input style={{ color: props.color }} id="upload-button" type="file" accept="image/*" onChange={props.changeFunc} />
    </div>
  )
};

export default UploadButton