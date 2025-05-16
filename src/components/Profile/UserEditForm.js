import React, {useState, useEffect, useContext} from "react";
import UserContext from "../../context/UserContext";
import "../../styles/UserEditForm.css"

export default function UserEditForm ({ setIsEditing }){
    const {user, setUser} = useContext(UserContext);

    const [name, setName] = useState(user.name);
    const [mail, setMail] = useState(user.mail);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errors, setErrors] = useState({});
    const usernameMinLength = 3;
    const mailMinLength = 5;
    const passwordMinLength = 8;

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
        const newErrors = {};
        console.log(name.length < usernameMinLength);
        console.log(mail.length < mailMinLength || !mail.includes('@'));
        console.log(newPassword && newPassword.length < passwordMinLength);
        console.log(newPassword && password.length < passwordMinLength);

        if (name.length < usernameMinLength) {
            newErrors.name = `Name must be at least ${usernameMinLength} characters`;
        }

        if (mail.length < mailMinLength || !mail.includes('@')) {
            newErrors.mail = 'Please enter a valid email address';
        }

        if (newPassword && newPassword.length < passwordMinLength) {
            newErrors.newPassword = `Password must be at least ${passwordMinLength} chars`;
        }

        if (newPassword && password.length < passwordMinLength) {
            newErrors.password = 'Enter current password to confirm password change';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log('sending put request!');
        setUser(prev =>({...prev, name, mail}));
        setPasswordsToDefault();
        setErrors({});
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
                {errors.name && <span className="error">{errors.name}</span>}
                <li>
                    Mail: <input name="mail" type="mail" value={mail} onChange={handleChange}></input>
                </li>
                {errors.mail && <span className="error">{errors.mail}</span>}
                <li>
                    New Password: <input name="new-password" type="password" value={newPassword} onChange={handleChange} placeholder="Leave it empty, if you don`t want to change password"></input>
                </li>
                {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                {newPassword && (
                <>
                    <li>
                    Confirm Old Password: <input name="password" type="password" value={password} onChange={handleChange} />
                    </li>
                    {errors.password && <span className="error">{errors.password}</span>}
                </>
                )}
            </ul>
            <button onClick={handleCancel}>Cancel Changes</button>
            <button onClick={handleConfirm}>Confirm Changes</button>
        </div>
    );
}