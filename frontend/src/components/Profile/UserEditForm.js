import React, {useState, useContext} from "react";
import UserContext from "../../context/UserContext";
import "../../styles/UserEditForm.css";
import Validator from "../../validator/Validator";
import {api} from "../../services/api";

export default function UserEditForm ({ setIsEditing }){
    const {user, setUser} = useContext(UserContext);

    const [form, setForm] = useState({
        username: user.name,
        email: user.mail,
        password: '',
        newPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validator = new Validator()
    .addStrategy('username', Validator.minLength(1, 'Username must be at least 1 character'))
    .addStrategy('username', Validator.maxLength(16, 'Username must ba less than 16 character'))
    .addStrategy('email', Validator.email('Enter valid mail'))
    .addStrategy('newPassword', value => value && value.length < 6 ? `New password must be at least 6 characters` : null)
    .addStrategy('password', value => form.newPassword && value.length < 6 ? 'Enter current password to confirm password change' : null)

    const handleConfirm = async () =>{
        let packageForm = { ...form };
        const { isValid, errors } = validator.validateForm(form);
  
        if (!isValid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        
        if(!form.newPassword) {
            packageForm = {
                username: form.username,
                email: form.email
            };
        }

        try {
            await api.updateUser(user.id, packageForm);
            setUser(prev => ({...prev, name: form.username, mail: form.email}));
            setIsEditing(false);
        } catch (error) {
            console.error("Updating failed:", error);
        }
    };
    
    const handleCancel = () =>{
        setIsEditing(false);
    };
    
    const handleChange = (e) =>{
        const field = e.target.name;
        setForm(prev => ({...prev, [field]: e.target.value}));
    };

    return(
        <div className="user-editing">
            <ul>
                <li>
                    Name: <input name="username" type="text" value={form.username} onChange={handleChange}></input>
                </li>
                {errors.username && <span className="error">{errors.username}</span>}
                <li>
                    Mail: <input name="email" type="email" value={form.email} onChange={handleChange}></input>
                </li>
                {errors.email && <span className="error">{errors.email}</span>}
                <li>
                    New Password: <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="Leave it empty, if you don`t want to change password"></input>
                </li>
                {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                {form.newPassword && (
                <>
                    <li>
                    Confirm Old Password: <input name="password" type="password" value={form.password} onChange={handleChange} />
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
