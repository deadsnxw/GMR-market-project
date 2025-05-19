import React, { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserContext from "../context/UserContext";

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
    const [isOwner, setIsOwner] = useState(true); 
    //Sendind Get request on /users/user.id/products, after this comparising productId with productIds, we got


    return user && user.isShop && isOwner ? component : <div>203 not found</div>;
}