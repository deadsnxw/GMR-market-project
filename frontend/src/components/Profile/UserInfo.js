import React from "react";
import "../../styles/UserInfo.css"

export default function UserInfo ({user, setIsEditing}){
    const handleEdit = () =>{
        setIsEditing(true);
    };

    return(
        <div className="user-info">
            <ul>
                <li>
                    Name: {user.name}
                </li>
                <li>
                    Mail: {user.mail}
                </li>
                <li>
                    Password: ********
                </li>
                {!user.isShop &&
                <li>
                    Balance: {user.balance}$
                </li>
                }
            </ul>
            <button onClick={handleEdit}>Edit Profile</button>
        </div>
    );
}
