import React, { useRef } from 'react';

export default function NrmMapGenCanvas(props) {

    let cv = window.cv //Load opencv.
    const Canvas = useRef() //React ref to get the canvas.
    const img = new Image()
    let baseImg = null //Stores the unprocessed img.
    let sobelxData = null
    let sobelyData = null

    //Vector class to store vectors. 
    let Vector = function (x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    //Normalizes a given vector.
    Vector.prototype.Normalize = function () {
        let length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
        this.x = this.x / length;
        this.y = this.y / length;
        this.z = this.z / length;
    }

    //Generate a normal map from the image loaded on the canvas.
    //TODO::If not fast enough, convert sobels to img data.
    function GenerateNormalMap() {

        const canvas = Canvas.current
        const ctx = canvas.getContext("2d")
        baseImg = cv.imread(img); //base img

        let srcImg = baseImg; //base img
        let sobelxCVMat = new cv.Mat();
        let sobelyCVMat = new cv.Mat();
        let canvasData = null //

        //Convert to grayscale.
        cv.cvtColor(srcImg, srcImg, cv.COLOR_RGB2GRAY, 0);

        //Blur image.
        let ksize = new cv.Size(2, 2);
        let anchor = new cv.Point(-1, -1);
        cv.blur(srcImg, srcImg, ksize, anchor, cv.BORDER_DEFAULT);

        //Compute sobel in the X direction
        cv.Sobel(srcImg, sobelxCVMat, -1, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.imshow(canvas, sobelxCVMat) //show img on canvas so we can access it
        canvasData = ctx.getImageData(0, 0, img.width, img.height);
        sobelxData = canvasData.data.slice();

        //Compute sobel in the Y direction
        cv.Sobel(srcImg, sobelyCVMat, -1, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.imshow(canvas, sobelyCVMat) //show img on canvas so we can access it
        canvasData = ctx.getImageData(0, 0, img.width, img.height);
        sobelyData = canvasData.data.slice();

        //Two values that can be controlled using sliders.
        let intensity = 0.01; 
        let level = 1;
        
        canvasData = ctx.getImageData(0, 0, img.width, img.height); //TODO::This step may not be needed.


        //Loop through the pixels and calculate the RGB colors. This is where the normal map is "created".
        for (let i = 0; i < canvasData.data.length; i += 4) {

            let dX = sobelxData[i]
            let dY = sobelyData[i]
            let dZ = 1.0 / intensity

            let vector = new Vector(dX, dY, dZ)
            vector.Normalize()

            canvasData.data[i] = (vector.x/level * 0.5 + 0.5) * 255.0; //red
            canvasData.data[i + 1] = (vector.y/level * 0.5 + 0.5) * 255.0; //green
            canvasData.data[i + 2] = (vector.z/level) * 255.0; //blue
            canvasData.data[i + 3] = 255.0;
        }

        ctx.putImageData(canvasData, 0, 0, 0, 0, img.width, img.height)
        srcImg.delete(); sobelxCVMat.delete(); sobelyCVMat.delete();

        //Experimental blur code.
        // let ksize = new cv.Size(3, 3);
        // let anchor = new cv.Point(-1, -1);
        // cv.blur(src, src, ksize, anchor, cv.BORDER_DEFAULT);
        // let kdata = [-1,-1,-1,-1,20,-1,-1,-1,-1] ;
        // let M = cv.matFromArray(3,3, cv.CV_32FC1,kdata);
        // cv.filter2D(src, src, -1, M, anchor, 0, cv.BORDER_DEFAULT);
    }


    function updateNormalMap(intensity, level){
        const canvas = Canvas.current
        const ctx = canvas.getContext("2d")

        let canvasData = ctx.getImageData(0, 0, img.width, img.height); //TODO::This step may not be needed.

         //Loop through the pixels and calculate the RGB colors. This is where the normal map is "created".
         for (let i = 0; i < canvasData.data.length; i += 4) {

            let dX = sobelxData[i]
            let dY = sobelyData[i]
            let dZ = 1.0 / intensity

            let vector = new Vector(dX, dY, dZ)
            vector.Normalize()

            canvasData.data[i] = (vector.x/level * 0.5 + 0.5) * 255.0; //red
            canvasData.data[i + 1] = (vector.y/level * 0.5 + 0.5) * 255.0; //green
            canvasData.data[i + 2] = (vector.z/level) * 255.0; //blue
            canvasData.data[i + 3] = 255.0;
        }

    }

    //Entry point.
    //This function gets called when an image is loaded.
    const onImgLoad = (event) => {

        //Converts the loaded "thing" into an img.
        if (event.target.files && event.target.files[0]) {
            img.src = URL.createObjectURL(event.target.files[0])
        }

        //onload is used to make sure that the img is fully loaded before any processing.
        img.onload = function () {
            props.isImageLoaded(true)
            GenerateNormalMap()
        }
    }


    //HTML elements of this component.
    return (
        <div id="canvas-container">
            <canvas id="normal-canvas" ref={Canvas} width="250" height="250"></canvas>
            <input id="upload-button" type="file" accept="image/*" onChange={onImgLoad} />
        </div>
    )
}
