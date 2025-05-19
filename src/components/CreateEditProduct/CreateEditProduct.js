import React, { useState, useCallback, useEffect } from "react";
import TagComponent from "./TagComponent";
import "../../styles/CreateEditProduct.css"
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router-dom";

export default function CreateEditProduct ({isEditing = false}){

    const navigate = useNavigate();
    const [form, setForm] = useState({
        images: [],
        name: '',
        description: '',
        amount: '',
        price: '',
        tags: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEditing);
    const productNameMinLength = 4;
    const productNameMaxLength = 30;
    const descriptionMinLength = 15;
    const imagesMaxAmount = 6;
    const productTags = ["electronics", "clothing", "home", "kitchen", "furniture", "smartphone", "laptop", "headphones", "wearable", "gadget", "men", "women", "kids", "summer", "winter", "appliances", "decor", "cookware", "utensils", "storage", "sports", "outdoor", "fitness", "beauty", "skincare", "organic", "sustainable", "luxury", "budget", "premium", "new", "sale", "bestseller", "limited"];

    useEffect(()=>{
        if(isEditing){
           fetch("/product.json")
            .then((response) => response.json())
            .then((data) => {
                setForm({
                    images: data.images,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    price: `${data.price}`,
                    tags: data.tags
                });
                setLoading(false);
            }); 
        }
    }, [isEditing]);

    const validatorsStrategy = {
        images: (value) => 
            value.length <= 0 || value.length > imagesMaxAmount 
        ? `Must be 1-${imagesMaxAmount} photo` 
        : null,

        name: (value) =>
            value.length < productNameMinLength || value.length > productNameMaxLength
            ? `Name must be ${productNameMinLength}-${productNameMaxLength} characters`
            : null,

        description: (value) => 
            value.length < descriptionMinLength
            ? `Description must be at least ${descriptionMinLength} characters`
            : null,
            
        amount: (value) => {
            const num = Number(value);
            return isNaN(num) || !Number.isInteger(num) || num <= 0 
            ? 'Enter valid amount' 
            : null;
        },
        price: (value) => {
            const num = Number(value);
            return isNaN(num) || isValidPrice(value) || num <= 0
            ? 'Enter valid price'
            : null;
        },
        tags: (value) => value.length <= 0 ? 'Must be at least 1 tag' : null
    };

    const buttonsStrategy = {
        'delete': () => {console.log('deleting')},   //send DELETE request to back
        'cancel': () => {navigate('/me')}
    }

    const processImages = (files) => {
        const imageFiles = Array.from(files).filter(file => file.type.match('image.*'));
        
        if (imageFiles.length === 0) {
            return;
        }

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setForm(prev => {
                    if (prev.images.includes(e.target.result)) {
                        return prev;
                    }
                    return {
                        ...prev,
                        images: [...prev.images, e.target.result]
                    };
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileInput = useCallback((e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processImages(files);
        }
    }, []);

    const isValidPrice = (num) =>{
        if (num.indexOf('.') === -1) return false;
  
        const decimalPart = num.split('.')[1];
        return decimalPart.length > 2;
    };

    const handleChange = (e, field) => {
        setForm(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = () =>{
        const newErrors = Object.entries(form).reduce((acc, [field, value]) => {
            const error = validatorsStrategy[field](value);
            if (error) acc[field] = error;
            return acc;
        }, {});

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log(isEditing ? 'sending put request!' : 'sending post request!');
        setErrors({});
    }

    const handleClick = (strategy) =>{
        buttonsStrategy[strategy]();
    }

    const preventDef = (e) =>{
        e.preventDefault();
        e.stopPropagation();
    }

    if(loading) return <div>Loading...</div>

    return(
        <>
            <div className="create-product">
                <h1>{isEditing ? 'Edit' : 'Create'} Product</h1>
                <div className="images-input">
                    <p className="image-hint">Click On Image To Delete</p>
                    <div className="product-images">
                        {form.images.map(image => <ImageComponent key={image} setForm={setForm} image={image}></ImageComponent>)}
                    </div>
                    {form.images.length < imagesMaxAmount && <div 
                        className="file-upload-area"
                        onClick={() => document.getElementById('file-input').click()}
                        onDragOver={preventDef}
                        onDragEnter={preventDef}
                        onDrop={(e) => {
                            preventDef(e);
                            if (e.dataTransfer.files[0]) {
                                handleFileInput({ target: { files: e.dataTransfer.files } });
                            }
                        }}
                        >
                            Drop/Choose Image Here
                            <input 
                                id="file-input"
                                type="file" 
                                accept="image/*"
                                onChange={handleFileInput}
                                style={{ display: 'none' }} 
                            />
                    </div>}
                </div>
                {errors.images && <span className="error">{errors.images}</span>}

                <ul>
                    <li>
                        Name: 
                        <input 
                        type="text" 
                        value={form.name} 
                        onChange={(e)=>handleChange(e, 'name')} 
                        placeholder="Enter product name..." />
                    </li>
                    {errors.name && <span className="error">{errors.name}</span>}
                    <li>
                        Description: 
                        <textarea 
                        value={form.description} 
                        onChange={(e)=>handleChange(e, 'description')} 
                        placeholder="Enter product description..." />
                    </li>
                    {errors.description && <span className="error">{errors.description}</span>}
                    <li>
                        Total Amount: 
                        <input 
                        type="text" 
                        value={form.amount} 
                        onChange={(e)=>handleChange(e, 'amount')} 
                        placeholder="Enter amount of product..." />
                    </li>
                    {errors.amount && <span className="error">{errors.amount}</span>}
                    <li>
                        Price: 
                        <input 
                        type="text" 
                        value={form.price} 
                        onChange={(e)=>handleChange(e, 'price')} 
                        placeholder="Enter product price..." />
                    </li>
                    {errors.price && <span className="error">{errors.price}</span>}
                    <li>
                        Tags: 
                        <div className="tags-div">
                            {productTags.map(name=><TagComponent key={name} tags={form.tags} setForm={setForm} name={name}></TagComponent>)}
                        </div>
                    </li>
                    {errors.tags && <span className="error">{errors.tags}</span>}
                </ul>
            </div>
            <div className="buttons">
                {isEditing && <button onClick={()=>handleClick('delete')}>Delete</button>}
                <button onClick={()=>handleClick('cancel')}>Cancel</button>
                <button onClick={handleSubmit}>{isEditing ? 'Edit' : 'Create'}</button>
            </div>
        </>
    );
}
