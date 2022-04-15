import React from 'react';

import '../css/upload_button.css';

const UploadButton = (props) => {

  return (
   
      <input style={{ color: props.color }} id="upload-button" type="file" accept="image/*" onChange={props.changeFunc} />
   
  )
};

export default UploadButton