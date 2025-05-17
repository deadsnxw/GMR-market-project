import React from "react";
import "../../styles/ImageComponent.css"

export default function ImageComponent ({setImages, image}){

    const handleClick = () =>{
        setImages(prev=> prev.filter(img=> img !== image));
    }

    return(
        <div className="image-wrapper" onClick={handleClick}>
            <img src={image} alt="placeholder"></img>
        </div>
    );
}
