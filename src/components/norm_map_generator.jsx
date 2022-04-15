import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../css/norm_map_generator.css';
import SliderWrapper from './slider_wrapper';
import UploadButton from './upload_button';

let baseImgMat = null //Stores the unprocessed img.
let srcImgMat = null
let sobelxData = null
let sobelyData = null
let canvas = null
let ctx = null
let canvasData = null //TODO::This step may not be needed.
let imgSize = [0,0]
let orgSize = [0,0]
let isImgLoaded = false;
let dZ = 1
let globalBlurAmnt = 0;

const img = new Image()


function NrmMapGenCanvas(props, ref){
    
    // let Caman = window.Caman
    let cv = window.cv //Load opencv.
    
    const Canvas = useRef() //React ref to get the canvas.
    const HDCanvas = useRef()
    const isRenderHighRes = useRef(false);

    const [intensity, setIntensity] = useState(50/5000); //Slider State
    const [detail, setDetail] = useState(1); //Slider State
    const [blurAmount, setBlurAmount] = useState(0)


    /**
     * Pretty sure there is a shorter way to write this.
     */
    function getBestSize(){
        let targetSize = 1000;
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
        if(isRenderHighRes.current){
            canvas = HDCanvas.current
        }
        else{
            canvas = Canvas.current
        }
        ctx = canvas.getContext("2d")
        baseImgMat = cv.imread(img); //base img
        srcImgMat = baseImgMat; //base img
        orgSize[0] = img.width
        orgSize[1] = img.height

        if(isRenderHighRes.current){
            imgSize[0] = orgSize[0]
            imgSize[1] = orgSize[1]
        }
        else{
            getBestSize()
            let dsize = new cv.Size(imgSize[0], imgSize[1]);
            cv.resize(srcImgMat, srcImgMat, dsize, 0, 0, cv.INTER_AREA);
        }
        

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
    dZ = 1.0/ intensity * (1.0 + Math.pow(2.0, detail))
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
        blurUpdate()
    }


    //Blurs the canvas contents.
    function blurUpdate(){
        if(isImgLoaded){
            ctx.filter = `blur(${globalBlurAmnt}px)`;
            ctx.putImageData(canvasData, 0, 0, 0, 0, imgSize[0], imgSize[1])
            ctx.drawImage(canvas, 0, 0);
        }
    }

    //Updates the normal map on slider change.
    function onIntensityChange(event){
        setIntensity(event.target.value); 
        if(isImgLoaded){
            updateNormalMap()
        }
    }

    //Updates the normal map on slider change.
    function onLevelChange(event){
        setDetail(event.target.value * -1); 
        if(isImgLoaded){
            updateNormalMap()
        }
    }

    useImperativeHandle(ref, () => ({
        GenerateNormalMap,
        isRenderHighRes
    }), [])

    // Makes sure to update the canvas on intensity change
    useEffect(() => {
        if(isImgLoaded){
        updateNormalMap()
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
            props.setImageLoaded(true)
            GenerateNormalMap()
        }
    }


    //HTML elements of this component.
    return (
        <div id="canvas-container">
            <p>Upload Image:
                Intensity
                <SliderWrapper min_value={0.00001} max_value={0.05} step_value={0.0001} default_value={0.01} funcForThis={(event) => {onIntensityChange(event)}} />
                Detail
                <SliderWrapper min_value={-10} max_value={10} step_value={0.1} default_value={1} funcForThis={(event) => {onLevelChange(event)}} />
                Blur
                <SliderWrapper min_value={0} max_value={13} step_value={0.0001} default_value={0} funcForThis={(event) => {setBlurAmount(event.target.value); globalBlurAmnt = event.target.value; blurUpdate();}} />

                <UploadButton color="white" changeFunc={onImgLoad} />
            </p>
            <canvas id="normal-canvas" ref={Canvas} width="250" height="250"></canvas>
            <canvas id="highres-canvas" ref={HDCanvas} width="250" height="250"></canvas>
        </div>
    )
}

export default forwardRef(NrmMapGenCanvas)
