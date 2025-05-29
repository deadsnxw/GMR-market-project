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
    const [isOwner, setIsOwner] = useState(false); 

    // fetch(`/api/check/{user.id} `, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({productId})
    // })
    // .then((response) => {
    //     if (!response.ok) {
    //         throw new Error('Server error');
    //     }
    //     return response.json()
    // })
    // .then((data) => {
    //     setIsOwner(data.isOwner)
    //  })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

    return user && user.isShop && isOwner ? component : <div>203 not found</div>;
}