import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ProductCard.css';

export default function ProductCard ({product}){
    const navigate = useNavigate();

    const handleClick = () =>{
        navigate(`/product/${product.id}`)
    }

    return(
        <div className="product-card" onClick={product.amount ? handleClick : null}>
            <img src={product.image} alt="placeholder"></img>
            <div className="product-card-info">
                <h1>{product.name}</h1>
                <ul>
                    <li>
                        {product.amount ? product.amount : 'out of stocks'}
                    </li>
                    <li>
                        Price: {product.price}$
                    </li>
                </ul>
            </div>
        </div>
    );
}