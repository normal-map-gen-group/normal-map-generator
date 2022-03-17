import React, {useRef} from 'react';
import './App.css';

function App() {

  const Canvas = useRef()
  let cv = window.cv
  const img = new Image()

  

  let Vector = function(x, y, z){
    this.x = x
    this.y = y
    this.z = z
  }

  Vector.prototype.Normalize = function(){
    let length = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
    this.x = this.x/length;
    this.y = this.y/length;
    this.z = this.z/length;
  }

  const onImgLoad = (event) =>{

    const canvas = Canvas.current
    const ctx = canvas.getContext("2d")

    if(event.target.files && event.target.files[0]){
      img.src = URL.createObjectURL(event.target.files[0])
    }

    img.onload = function(){
      // ctx.drawImage(img, 0, 0, 500, 500)
      let src = cv.imread(img);
      let dstx = new cv.Mat();
      let dsty = new cv.Mat();

      //grayscale
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

      let ksize = new cv.Size(2, 2);
      let anchor = new cv.Point(-1, -1);
      cv.blur(src, src, ksize, anchor, cv.BORDER_DEFAULT);

      //Steps: Compute Sobel In X, Compute Sobel in Y
      // R = Sobel X
      // G = Sobel Y
      // B = 1.0/strength
      
      // //X SOBEL
      cv.Sobel(src, dstx, -1, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
      cv.imshow(canvas, dstx) //show img on canvas so we can access it
      let imgData = ctx.getImageData(0, 0, img.width, img.height);
      let sobelX = imgData.data.slice();

      // //Y SOBEL
      cv.Sobel(src, dsty, -1, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
      cv.imshow(canvas, dsty) //show img on canvas so we can access it

      imgData = ctx.getImageData(0, 0, img.width, img.height);
      let sobelY = imgData.data.slice();

      let intensity = 0.01;
      // let level = 1;
      imgData = ctx.getImageData(0, 0, img.width, img.height);

      for(let i = 0; i < imgData.data.length; i += 4) {
      
        let dX = sobelX[i]
        let dY = sobelY[i]
        let dZ = 1.0/intensity

        let vector = new Vector(dX, dY, dZ)
        vector.Normalize()

        imgData.data[i] = (vector.x * 0.5 + 0.5) * 255.0;
        imgData.data[i + 1] = (vector.y * 0.5 + 0.5) * 255.0;
        imgData.data[i + 2] = (vector.z) * 255.0;
        imgData.data[i + 3] = 255.0;


        // dst[dstOff] = (dX/l * 0.5 + 0.5) * 255.0; 	// red
				// dst[dstOff+1] = (dY/l * 0.5 + 0.5) * 255.0; 	// green
				// dst[dstOff+2] = dZ/l * 255.0; 			

      }
      // let ksize = new cv.Size(3, 3);
      // let anchor = new cv.Point(-1, -1);
      // cv.blur(src, src, ksize, anchor, cv.BORDER_DEFAULT);

      // let kdata = [-1,-1,-1,-1,20,-1,-1,-1,-1] ;
      // let M = cv.matFromArray(3,3, cv.CV_32FC1,kdata);
      // cv.filter2D(src, src, -1, M, anchor, 0, cv.BORDER_DEFAULT);


      ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height)

      src.delete(); dstx.delete(); dsty.delete();
      
    }

  }


  const download_image = function(){
   
      var canvas = document.getElementById("canv");
      var anchor = document.createElement("a");
      anchor.href = canvas.toDataURL("image/png");
      anchor.download = "NormalMap.png";
      anchor.click();
    
    
  };

  return (
    
    <div className="App">
      
      <header className="App-header">
        <p>Normal Map Generator</p>
        <p>Upload an image:</p>
        <p>
          
          {/* <UploadImages></UploadImages> */}
          <canvas id="canv" ref={Canvas} width="500" height="500"></canvas>
          <input style={{color: 'white'}} id="upload-button" type="file" accept="image/*" onChange={onImgLoad}/>  

          {/* this button "works" but downloads an image of unsupported type. not sure whats happening here*/}
          <button style={{color: 'white'}} id="download-button" onClick={download_image}>Download Image</button>        

        </p>
  
      </header>
    </div>
  );

  
}



export default App;
