import React, {useState, useEffect, useContext} from "react";
import UserContext from "../../context/UserContext";
import "../../styles/UserEditForm.css"

export default function UserEditForm ({ setIsEditing }){
    const {user, setUser} = useContext(UserContext);

    const [name, setName] = useState(user.name);
    const [mail, setMail] = useState(user.mail);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const changeStrategy ={
        'name': (value)=>{setName(value);},
        'mail': (value)=>{setMail(value);},
        'new-password': (value)=>{setNewPassword(value);},
        'password': (value)=>{setPassword(value);}
    };

    useEffect(() => {
        setName(user.name);
        setMail(user.mail);
    }, [user]);

    const setPasswordsToDefault = () =>{
        setPassword('');
        setNewPassword('');
    };

    const setStatesToDefault = () =>{
        setName(user.name);
        setMail(user.mail);
        setPasswordsToDefault();
    };

    const handleConfirm = () =>{
        console.log('sending put request!');
        setUser(prev =>({...prev, name, mail}));
        setPasswordsToDefault();
        setIsEditing(false);
    };
    
    const handleCancel = () =>{
        setStatesToDefault();
        setIsEditing(false);
    };
    
    const handleChange = (e) =>{
        const strategy = e.target.name;
        changeStrategy[strategy](e.target.value);
    };
    
    return(
        <div className="user-editing">
            <ul>
                <li>
                    Name: <input name="name" type="text" value={name} onChange={handleChange}></input>
                </li>
                <li>
                    Mail: <input name="mail" type="mail" value={mail} onChange={handleChange}></input>
                </li>
                <li>
                    New Password: <input name="new-password" type="password" value={newPassword} onChange={handleChange} placeholder="Leave it empty, if you don`t want to change password"></input>
                </li>
                {newPassword &&
                <li>
                    Confirm Old Password: <input name="password" type="password" value={password} onChange={handleChange}></input>
                </li>
                }
            </ul>
            <button onClick={handleCancel}>Cancel Changes</button>
            <button onClick={handleConfirm}>Confirm Changes</button>
        </div>
    );
}