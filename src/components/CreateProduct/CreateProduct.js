import React, { useState } from "react";
import TagComponent from "./TagComponent";
import "../../styles/CreateProduct.css"

export default function CreateProduct (){

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [tags, setTags] = useState('');
    const [errors, setErrors] = useState({});
    const productNameMinLength = 6;
    const descriptionMinLength = 15;
    const productTags = ["electronics", "clothing", "home", "kitchen", "furniture", "smartphone", "laptop", "headphones", "wearable", "gadget", "men", "women", "kids", "summer", "winter", "appliances", "decor", "cookware", "utensils", "storage", "sports", "outdoor", "fitness", "beauty", "skincare", "organic", "sustainable", "luxury", "budget", "premium", "new", "sale", "bestseller", "limited"];

    const changeStrategy = {
        'name': (value)=>{setName(value)},
        'description': (value)=>{setDescription(value)},
        'amount': (value)=>{setAmount(value)},
        'price': (value)=>{setPrice(value)},
    };

    const isValidPrice = (num) =>{
        if (num.indexOf('.') === -1) return false;
  
        const decimalPart = num.split('.')[1];
        return decimalPart.length > 2;
    };

    const handleChange = (e, strategy) =>{
        const value = e.target.value;
        changeStrategy[strategy](value);
    };

    const handleSubmit = () =>{
        const newErrors = {};
        const numberAmount = Number(amount);
        const priceNumber = Number(price);

        if (name.length < productNameMinLength) {
            newErrors.name = `Name must be at least ${productNameMinLength} characters`;
        }

        if (description.length < descriptionMinLength) {
            newErrors.description = `Description must be at least ${descriptionMinLength} characters`;
        }

        if (isNaN(numberAmount) || !Number.isInteger(numberAmount) || numberAmount <= 0) {
            newErrors.amount = 'Enter valid amount';
        }

        if (isNaN(priceNumber) || isValidPrice(price) || priceNumber <= 0) {
            newErrors.price = 'Enter valid price';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        console.log(priceNumber);
        console.log('sending put request!');
        setErrors({});
    }

    return(
        <>
            <div className="create-product">
                <h1>Create Product</h1>
                <div className="product-images">
                    <div className="photo-dropper">
                        Drop Photo Of Product Here
                    </div>
                </div>

                <ul>
                    <li>
                        Name: 
                        <input 
                        type="text" 
                        value={name} 
                        onChange={(e)=>handleChange(e, 'name')} 
                        placeholder="Enter product name..." />
                    </li>
                    {errors.name && <span className="error">{errors.name}</span>}
                    <li>
                        Description: 
                        <textarea 
                        value={description} 
                        onChange={(e)=>handleChange(e, 'description')} 
                        placeholder="Enter product description..." />
                    </li>
                    {errors.description && <span className="error">{errors.description}</span>}
                    <li>
                        Total Amount: 
                        <input 
                        type="text" 
                        value={amount} 
                        onChange={(e)=>handleChange(e, 'amount')} 
                        placeholder="Enter amount of product..." />
                    </li>
                    {errors.amount && <span className="error">{errors.amount}</span>}
                    <li>
                        Price: 
                        <input 
                        type="text" 
                        value={price} 
                        onChange={(e)=>handleChange(e, 'price')} 
                        placeholder="Enter product price..." />
                    </li>
                    {errors.price && <span className="error">{errors.price}</span>}
                    <li>
                        Tags: 
                        <div className="tags-div">
                            {productTags.map(name=><TagComponent key={name} tags={tags} setTags={setTags} name={name}></TagComponent>)}
                        </div>
                    </li>
                </ul>
            </div>
            <div className="buttons">
                <button>Cancel</button>
                <button onClick={handleSubmit}>Create</button>
            </div>
        </>
    );
}
