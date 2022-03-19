import React, { useRef, useState, useEffect } from 'react';

let baseImgMat = null //Stores the unprocessed img.
let srcImgMat = null
let sobelxData = null
let sobelyData = null
let canvas = null
let ctx = null
let canvasData = null //TODO::This step may not be needed.
let imgSize = [0,0]
let isImgLoaded = false;

const img = new Image()

export default function NrmMapGenCanvas(props) {

    let cv = window.cv //Load opencv.
    const Canvas = useRef() //React ref to get the canvas.

    const [intensity, setIntensity] = useState(50/5000); //Slider State

    //Generate a normal map from the image loaded on the canvas.
    //TODO::If not fast enough, convert sobels to img data.
    function GenerateNormalMap() {
        canvas = Canvas.current
        ctx = canvas.getContext("2d")
        baseImgMat = cv.imread(img); //base img
        srcImgMat = baseImgMat; //base img

        imgSize[0] = img.width/3
        imgSize[1] = img.height/3

        let dsize = new cv.Size(imgSize[0], imgSize[1]);
        cv.resize(srcImgMat, srcImgMat, dsize, 0, 0, cv.INTER_AREA);

        let sobelxCVMat = new cv.Mat();
        let sobelyCVMat = new cv.Mat();

        //Convert to grayscale.
        cv.cvtColor(srcImgMat, srcImgMat, cv.COLOR_RGB2GRAY, 0);

        //Blur image.
        let ksize = new cv.Size(2, 2);
        let anchor = new cv.Point(-1, -1);
        cv.blur(srcImgMat, srcImgMat, ksize, anchor, cv.BORDER_DEFAULT);

        //Compute sobel in the X direction
        cv.Sobel(srcImgMat, sobelxCVMat, -1, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.imshow(canvas, sobelxCVMat) //show img on canvas so we can access it
        canvasData = ctx.getImageData(0, 0, imgSize[0], imgSize[1]);
        sobelxData = canvasData.data.slice();

        //Compute sobel in the Y direction
        cv.Sobel(srcImgMat, sobelyCVMat, -1, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.imshow(canvas, sobelyCVMat) //show img on canvas so we can access it
        canvasData = ctx.getImageData(0, 0, imgSize[0], imgSize[1]);
        sobelyData = canvasData.data.slice();

        //Two values that can be controlled using sliders.
        // let intensity = 0.01;
        // let intensity = this.intensity;
        let level = 1;

        updateNormalMap()
        
        // srcImg.delete(); sobelxCVMat.delete(); sobelyCVMat.delete();

        //Experimental blur code.
        // let ksize = new cv.Size(3, 3);
        // let anchor = new cv.Point(-1, -1);
        // cv.blur(src, src, ksize, anchor, cv.BORDER_DEFAULT);
        // let kdata = [-1,-1,-1,-1,20,-1,-1,-1,-1] ;
        // let M = cv.matFromArray(3,3, cv.CV_32FC1,kdata);
        // cv.filter2D(src, src, -1, M, anchor, 0, cv.BORDER_DEFAULT);
    }


    let dZ = 1.0 / intensity
    function updateNormalMap() {

        //Loop through the pixels and calculate the RGB colors. This is where the normal map is "created".
        let dX = 0
        let dY = 0
        let length = 0

        for (let i = 0; i < canvasData.data.length; i += 4) {

            dX = sobelxData[i]
            dY = sobelyData[i]

            length = Math.sqrt(dX * dX + dY * dY + dZ * dZ)
            dX = dX / length;
            dY = dY / length;

            canvasData.data[i] = (dX * 0.5 + 0.5) * 255.0; //red
            canvasData.data[i + 1] = (dY * 0.5 + 0.5) * 255.0; //green
            canvasData.data[i + 2] = (dZ * 255.0); //blue
        }
        ctx.putImageData(canvasData, 0, 0, 0, 0, imgSize[0], imgSize[1])
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
            isImgLoaded = true;
            props.isImageLoaded(true)
            GenerateNormalMap()
        }
    }

    function onIntensityChange(event){
        setIntensity(event.target.value); 
        updateNormalMap()
    }

    useEffect(() => {
        if(isImgLoaded){
        updateNormalMap()
        }
     },[intensity])

    //HTML elements of this component.
    return (
        <div id="canvas-container">
            <p>Upload Image:
                <input type="range" min="0.00001" max="0.01" step="0.0001" defaultValue={0.01} onChange={(event) => {onIntensityChange(event)}}/>
                {/* <input type="range" min="0.00001" max="0.01" step="0.0001" defaultValue={0.01} onChange={(event) => {console.log(event.target.value)}}/> */}

                <input style={{ color: 'white' }} id="upload-button" type="file" accept="image/*" onChange={onImgLoad} />
            </p>
            <canvas id="normal-canvas" ref={Canvas} width="250" height="250"></canvas>

        </div>
    )
}
