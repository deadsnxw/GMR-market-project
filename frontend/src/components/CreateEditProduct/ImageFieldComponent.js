import React from "react";
import ImageComponent from "./ImageComponent";
import "../../styles/ImageFieldComponent.css"

export default function ImageFieldComponent ({images, setForm, error}){
    const handleImageUpload = (files) => {
        const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );
        if (imageFiles.length === 0) return;

        const remainingSlots = 6 - images.length;
        if (remainingSlots <= 0) return;

        const filesToUpload = imageFiles.slice(0, remainingSlots);

        for (const file of filesToUpload) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (!images.includes(e.target.result)) {
                    setForm((prev) => ({
                        ...prev,
                        images: [...prev.images, e.target.result],
                    }));
                }
            };
            reader.readAsDataURL(file);
        };
    };

    return(
        <div className="image-upload">
            <p>Product images (max 6):</p>
            <div className="image-preview">
                {images.map((img) => (
                    <ImageComponent key={img} setForm={setForm} image={img} />
                ))}
            </div>
    
            {images.length < 6 && (
                <label
                className="upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleImageUpload(e.dataTransfer.files);
                    }
                }}
                >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    style={{ display: "none" }}
                />
                Drag & drop images here or click to select
                </label>
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
}
