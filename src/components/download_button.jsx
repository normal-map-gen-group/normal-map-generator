import React from 'react';

import '../css/download_button.css';

export default function DownloadButton(props) {

  function download_image() {
    props.renderHighRes()
    var canvas = document.getElementById("highres-canvas");
    var anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "NormalMap.png";
    anchor.click();
  }

  return (
      <div>
        <button style={{color: 'white'}} id="download-button" onClick={download_image}>Download Image</button>
      </div>
  )
}