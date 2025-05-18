import React from "react";
import "../../styles/ImageComponent.css"

export default function ImageComponent ({setForm, image}){

    const handleClick = () =>{
        setForm(prev=> ({...prev, images: prev.images.filter(img=> img !== image)}));
    }

    return(
        <div className="image-wrapper" onClick={handleClick}>
            <img src={image} alt="placeholder"></img>
        </div>
    );
}
