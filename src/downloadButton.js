import React, {useRef} from 'react';
import './App.css';


//this is my download button testing code file - can be ignored for now
function download_imageeeee() {


  return (
    <div className="download">
      
      <header className="download-header">
        
        <p>
        <button id="download-button" onclick="download_image()">Download this image istg</button>
          

        </p>
      </header>
    </div>
  );
}

export default App;
const download_img = function(el) {
    var image = Canvas.toDataURL("image/png");
    el.href = image;
  };

const download = function(){
    console.log(5);
    var image = new Image();
    image.src = Canvas.toDataURL();
    image.download = 'filename.png';
    image.href = document.getElementById('canv').toDataURL()
    image.click();
}


var download2 = function(){
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
  }

  function download_image(){
    var canvas = document.getElementById("canv");
    var image = new Image();
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = image;
    link.click();
  }