import React from "react";
import "../../styles/TagComponent.css"

export default function TagComponent ({tags, setForm, name}){

    const handleClick = () => {
        setForm(prev => {
            if(prev.tags.includes(name)) {
                return {
                    ...prev,
                    tags: prev.tags.filter(value => value !== name)
                };
            }
            return {
                ...prev,
                tags: [...prev.tags, name]
            };
        });
    };

    return(
        <div className={`tag ${tags.includes(name) ? 'included' : ''}`} onClick={handleClick}>
            {name}
        </div>
    );
}
