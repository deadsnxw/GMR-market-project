import React, { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "../../context/UserContext";
import ProductCard from "../ProductCard";
import UserEditForm from "./UserEditForm";
import UserInfo from "./UserInfo";
import '../../styles/UserProfile.css';
import { useNavigate } from "react-router-dom";
import {api} from "../../services/api";

export default function UserProfile(){
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentFirstCard, setCurrentFirstCard] = useState(0);

    const productsPerPage = 4;

    const cardChangeStrategy ={
        'prev': ()=>{setCurrentFirstCard(prev=>(prev > 0 ? --prev : prev))},
        'next': ()=>{setCurrentFirstCard(prev=>(prev + productsPerPage < products.length ? ++prev : prev))}
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsData = await api.getProducts(user.id);
                setProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error("Updating failed:", error);
            }
        }
        fetchData();
    }, []);

    const getCurrentCards = useCallback(() => {
        const startIndex = currentFirstCard;
        return products.slice(startIndex, startIndex + productsPerPage);
    }, [currentFirstCard, products]);

    const handleCardChange = (strategy) => {
        cardChangeStrategy[strategy]();
    };

    if(loading) return <div>Loading...</div>

    return(
        <div className="user-page">
            <div className="user-profile">
                <h1>Welcome, {user.name}</h1>
                {isEditing ? 
                    <UserEditForm setIsEditing={setIsEditing} ></UserEditForm>
                : 
                    <UserInfo user={user} setIsEditing={setIsEditing}></UserInfo>
                }
            </div>
            <h1>{user.isShop ? 'Your' : 'Purchased'} Products</h1>
            {products.length === 0 ? <div>You have no products here</div> : 
            (<div className="products-container">
                <button onClick={()=>handleCardChange('prev')}>&lt;</button>
                <div className="products">
                    {getCurrentCards().map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <button onClick={()=>handleCardChange('next')}>&gt;</button>
            </div>)}
            {user.isShop ? <button onClick={()=> navigate('/me/create')}>Add New Product</button> : null}
        </div>
    );
}