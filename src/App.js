import React, {useRef} from 'react';
import './App.css';
import UploadImages from './UploadImages';


function App() {

  const Canvas = useRef()
  let cv = window.cv
  const img = new Image

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

      //Steps: Compute Sobel In X, Compute Sobel in Y
      // R = Sobel X
      // G = Sobel Y
      // B = 1.0/strength
      
      // //X SOBEL
      cv.Sobel(src, dstx, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
      cv.imshow(canvas, dstx) //show img on canvas so we can access it
      let imgData = ctx.getImageData(0, 0, img.width, img.height);
      let sobelX = imgData.data.slice();

      // //Y SOBEL
      cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
      cv.imshow(canvas, dsty) //show img on canvas so we can access it

      imgData = ctx.getImageData(0, 0, img.width, img.height);
      let sobelY = imgData.data.slice();

      let intensity = 0.1;
      imgData = ctx.getImageData(0, 0, img.width, img.height);

      for(let i = 0; i < imgData.data.length; i += 4) {
      
        let dX = sobelX[i]
        let dY = sobelY[i]
        let dZ = 1.0/intensity

        let vector = new Vector(dX, dY, dZ)
        vector.Normalize()

        imgData.data[i] = (vector.x * 0.5 + 0.5) * 255;
        imgData.data[i + 1] = (vector.y * 0.5 + 0.5) * 255;
        imgData.data[i + 2] = (vector.z * 0.5 + 0.5) * 255;
        imgData.data[i + 3] = 255;

        // dst[dstOff] = (dX/l * 0.5 + 0.5) * 255.0; 	// red
				// dst[dstOff+1] = (dY/l * 0.5 + 0.5) * 255.0; 	// green
				// dst[dstOff+2] = dZ/l * 255.0; 			

      }




      ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height)

      src.delete(); dstx.delete(); dsty.delete();
    }

  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          {/* <UploadImages></UploadImages> */}
          <canvas ref={Canvas} width="500" height="500"></canvas>
          <input id="upload-button" type="file" accept="image/*" onChange={onImgLoad}/>
        </p>
      </header>
    </div>
  );
}

export default App;
