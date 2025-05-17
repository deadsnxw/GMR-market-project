import React from "react";
import "../../styles/TagComponent.css"

export default function TagComponent ({tags, setTags, name}){

    const handleClick = () =>{
        setTags(prev => 
            prev.includes(name) ? 
            prev.filter(value=> value !== name):
            [...prev, name])
    }

    return(
        <div className={`tag ${tags.includes(name) ? 'included' : ''}`} onClick={handleClick}>
            {name}
        </div>
    );
}
