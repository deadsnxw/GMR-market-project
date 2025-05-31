import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import '../styles/ProductInfo.css'

export default function ProductInfo(){
    const {user, setUser} = useContext(UserContext);

    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPhoto, setCurrentPhoto] = useState(0);

    const shouldShowBuyButton = !user || (user && !user.isShop);

    const purchaseStrategys = {
        'user': (product) =>{
            if(user.balance >= product.price) {
                fetch(`/api/buy/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id })
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Server error');
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(prev => ({...prev, balance: data.balance}));
                    setProduct(prev => ({...prev, amount: --prev.amount}))
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
            console.log(user.balance >= product.price ? 'Purchased' : 'Not Enough Money');},
        'guest': (product) =>{navigate('/login');}
    }

    useEffect(()=>{
        // fetch("/product.json")
        // .then((response) => response.json())
        // .then((data) => {
        //     setProduct(data);
        //     setLoading(false);
        // });
        
        fetch(`/api/product/${productId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Server error');
            }
            return response.json()
        })
        .then((data) => {
            setProduct(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);


    const handleClick = (direction) =>{
        setCurrentPhoto(prev => {
            let newState = prev;
            if (direction === 'left' && prev > 0) {
                newState--;
            }
            if (direction === 'right' && prev < product.images.length - 1) {
                newState++;
            }
            return newState;
        });
    }

    const handleBuy = () =>{
        const strategy = user ? 'user' : 'guest';
        purchaseStrategys[strategy](product);
    }

    if (loading) return <div>Loading...</div>;

    return(
        <div className="product-info">
            <div className="photo-scroller">
                <button onClick={()=>handleClick('left')}>&lt;</button>
                <img src={product.images[currentPhoto]} alt="placeholder"></img>
                <button onClick={()=>handleClick('right')}>&gt;</button>
            </div>
            <div className="photo-indicator">
                {product.images.map((_, idx) => (
                    <span 
                        key={idx}
                        className={`dot ${currentPhoto === idx ? 'active' : ''}`}
                        onClick={() => setCurrentPhoto(idx)}
                    />
                ))}
            </div>
            <h1>{product.name}</h1>
            <h4>stock: {product.amount ? product.amount : 'out of stocks'}</h4>
            <div className="buy-container">
                <h3>{product.price}$</h3>
                {shouldShowBuyButton && <button onClick={handleBuy} disabled={!product.amount}>Buy</button>}
                {user && user.id === product.creatorId && <button onClick={() => navigate(`/product/${product.id}/edit`)}>Edit</button>}
            </div>
            <div className="product-description">{product.description}</div>
            <div className="product-tags">
                <ul>
                    {product.tags.map(tag =>(
                        <li key={tag}>
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
