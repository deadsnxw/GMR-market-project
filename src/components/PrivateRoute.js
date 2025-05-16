import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
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