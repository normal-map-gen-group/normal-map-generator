import React, { useState, useEffect } from 'react';

export default function UploadImages() {
    const [images, setImages] = useState([]);
    const [imagesURLs, setImageURLs] = useState([]);

    useEffect(() => {
        if (images.length < 1) return;
        const newImageURLs = [];
        images.forEach(image => newImageURLs.push(URL.createObjectURL(image)));
        setImageURLs(newImageURLs);
    }, [images]);

    function onImageChange(e) {
        setImages([...e.target.files]);
    }

    return (
        <>
            <input type="file" multiple accept="image/*" onChange={onImageChange} />
            { imagesURLs.map(imageSrc => <img src={imageSrc} className="App-logo" />) }
        </>
    );
}