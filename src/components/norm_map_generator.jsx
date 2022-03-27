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
let skipResize = false;

const img = new Image()

let gausianMatrix = [[0, 0, -1, 0, 0],
                     [0, 0, -2, 0, 0],
                     [-1, -2, 9, 0, 0],
                     [0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0],]

let boxMatrix = [[1/9, 1/9, 1/9],
                 [1/9, 1/9, 1/9],
                 [1/9, 1/9, 1/9]]





export default function NrmMapGenCanvas(props) {
    
    // let Caman = window.Caman
    let cv = window.cv //Load opencv.

    
    // var Caman = require('caman').Caman;
    const Canvas = useRef() //React ref to get the canvas.

    const [intensity, setIntensity] = useState(50/5000); //Slider State
    const [detail, setDetail] = useState(1); //Slider State
    const [blurAmount, setBlurAmount] = useState(0)
    const [sharpnessAmount, setSharpnessAmount] = useState(0)


    /**
     * Pretty sure there is a shorter way to write this, but I'm too fried right now.
     */
    function getBestSize(){
        let targetSize = 600;
        skipResize = false;
        if(img.width > img.height && img.width > targetSize){
            // let ratio = img.width/img.height
            let rescaleFactor = img.width / targetSize
            imgSize[0] = img.width / rescaleFactor
            imgSize[1] = img.height / rescaleFactor
        }
        else if(img.height > targetSize){
            let rescaleFactor = img.height / targetSize
            imgSize[0] = img.width / rescaleFactor
            imgSize[1] = img.height / rescaleFactor
        }
        else{
            let rescaleFactor = targetSize / img.width 
            imgSize[0] = img.width * rescaleFactor
            imgSize[1] = img.height * rescaleFactor
        }
    }

    //Generate a normal map from the image loaded on the canvas.
    //TODO::If not fast enough, convert sobels to img data.
    function GenerateNormalMap() {
        canvas = Canvas.current
        ctx = canvas.getContext("2d")
        baseImgMat = cv.imread(img); //base img
        srcImgMat = baseImgMat; //base img
        getBestSize()
        
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

        updateNormalMap()
        // srcImg.delete(); sobelxCVMat.delete(); sobelyCVMat.delete();
    }

    //TODO::Clean this
    let dZ = 1.0/ intensity * (1.0 + Math.pow(2.0, detail))
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



    //Blurs the canvas contents.
    function blurUpdate(){
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.putImageData(canvasData, 0, 0, 0, 0, imgSize[0], imgSize[1])
        ctx.drawImage(canvas, 0, 0);
    }
    
    //DO NOT DELETE
    // function sharpnessUpdate(){
    //     // ctx.putImageData(baseBuffer, 0, 0, 0, 0, imgSize[0], imgSize[1])
    //     Caman("#normal-canvas", function () {
    //         this.reloadCanvasData();
    //         // this.revert(false)
    //         this.sharpen(sharpnessAmount).render();
    //     });
    //     blurUpdate()
    // }

    //Updates the normal map on slider change.
    function onIntensityChange(event){
        setIntensity(event.target.value); 
        updateNormalMap()
    }

    //Updates the normal map on slider change.
    function onLevelChange(event){
        setDetail(event.target.value * -1); 
        updateNormalMap()
    }

    //DO NOT DELETE
    // function onSharpnessChange(event){
    //     setSharpnessAmount(event.target.value)
    //     sharpnessUpdate();
    // }


    // Makes sure to update the canvas on intensity change
    useEffect(() => {
        if(isImgLoaded){
        updateNormalMap()
        blurUpdate()
        }
     },[intensity, detail, blurAmount])



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


    //HTML elements of this component.
    return (
        <div id="canvas-container">
            <p>Upload Image:
                Intensity
                <input type="range" min="0.00001" max="0.05" step="0.0001" defaultValue={0.01} onChange={(event) => {onIntensityChange(event)}}/>
                Detail
                <input type="range" min="-10" max="10" step="0.1" defaultValue={1} onChange={(event) => {onLevelChange(event)}}/>
                Blur
                <input type="range" min="0" max="13" step="0.0001" defaultValue={0} onChange={(event) => {setBlurAmount(event.target.value); blurUpdate(); }}/>
            
                {/* <input type="range" min="0" max="50" step="1" defaultValue={0} onChange={(event) => {onSharpnessChange(event);}}/> */}

                <input style={{ color: 'white' }} id="upload-button" type="file" accept="image/*" onChange={onImgLoad} />
            </p>
            <canvas id="normal-canvas" ref={Canvas} width="250" height="250"></canvas>
        </div>
    )
}



//Not working :( DO NOT DELETE
    // function convolution(kernel) {
    //     let sum;
    //     let outputData = new ImageData(canvasData.width, canvasData.height)

    //     //For performance reasons, we calc constant offset here
    //     let xOffset = Math.floor(kernel.length / 2)
    //     let yOffset = Math.floor(kernel[0].length / 2)

    //     for (let row = 0; row < canvasData.height; row++) {
    //         for (let col = 0; col < canvasData.width; col++) {
    //             //sum for 4 pixels, although A will always be 255 in our case.
    //             sum = [0,0,0,255];

    //             for (let rowK = 0; rowK < kernel.length; rowK++) {
    //                 for (let colK = 0; colK < kernel[rowK].length; colK++) {

    //                     let pixelKRow = row + rowK - xOffset;
    //                     let pixelKCol = col + colK - yOffset;
    //                     let kValue = kernel[rowK][colK];

    //                     if (pixelKCol < 0 || pixelKCol >= canvasData.height ||
    //                         pixelKRow < 0 || pixelKRow >= canvasData.height) {
    //                         continue //Skip this iteration since we are out of bounds
    //                     }
                        
    //                     //Convert the row col into pixel location
    //                     let pixLoc = (pixelKRow * canvasData.width + pixelKCol) * 4;
                        
    //                     //For each channel in the image (we have 4, rgba. 
    //                     //but we skip a since its always 255)
    //                     for(let chan = 0; chan < 3; chan++){
    //                         sum[chan] += canvasData.data[pixLoc + chan] * kValue;
    //                     }
                        
    //                 }
    //             }
    //             let dstLoc = (row * canvasData.width + col) * 4;

    //             //For each channel in the image (we have 4, rgba. 
    //             for (let chan = 0; chan < 4; chan++) {
    //                 outputData.data[dstLoc + chan] = sum[chan];
    //             }
                
    //         }
    //     }
    //     ctx.putImageData(outputData, 0, 0, 0, 0, imgSize[0], imgSize[1])
    // }