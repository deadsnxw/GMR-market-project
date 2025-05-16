import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export function PrivateUserRoot ({component}){
    const {user} = useContext(UserContext);

    if (!user) return <Navigate to="/login" />;
    if (user.isShop) return <div />;
    return component;
}

export function PrivateShopRoot ({component}){
    const {user} = useContext(UserContext);

    return user.shop ? component : <Navigate to="/login" />
}