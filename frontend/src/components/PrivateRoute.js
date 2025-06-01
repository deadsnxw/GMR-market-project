import React, { useContext, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import {api} from "../services/api";

export function PrivateUserRoot ({component}){
    const {user} = useContext(UserContext);

    if (!user) return <Navigate to="/login" />;
    if (user.isShop) return <div>203 not found</div>;
    return component;
}

export function PrivateShopRoot ({component}){
    const {user} = useContext(UserContext);


    return user && user.isShop ? component : <div>203 not found</div>;
}

export function PrivateLoggedRoot ({component}){
    const {user} = useContext(UserContext);

    return user ? component : <Navigate to="/login" />
}

export function PrivateGuestRoot ({component}){
    const {user} = useContext(UserContext);

    return !user ? component : <Navigate to="/" />
}

export function PrivateShopCreatedRoot ({component}){
    const { productId } = useParams();
    const {user} = useContext(UserContext);
    const [isOwner, setIsOwner] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.checkOwnership(productId, user.id);
                setIsOwner(data.isOwner);
            } catch (error) {
                console.error("Fetching error:", error);
            }
        }
        fetchData();
    }, []);    

    return user && isOwner ? component : <div>203 not found</div>;
}
