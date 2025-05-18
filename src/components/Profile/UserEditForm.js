import React, {useState, useContext} from "react";
import UserContext from "../../context/UserContext";
import "../../styles/UserEditForm.css"

export default function UserEditForm ({ setIsEditing }){
    const {user, setUser} = useContext(UserContext);

    const [form, setForm] = useState({
        name: user.name,
        mail: user.mail,
        password: '',
        newPassword: ''
    });
    const [errors, setErrors] = useState({});
    const usernameMinLength = 1;
    const usernameMaxLength = 16;
    const passwordMinLength = 6;

    const validatorsStrategy = {
        name: (value) => (
            value.length < usernameMinLength || value.length > usernameMaxLength
            ? `Name must be ${usernameMinLength}-${usernameMaxLength} characters`
            : null
        ),
        mail: (value) => (!value.includes('@') ? 'Please enter a valid email address' : null),
        password: (value) => (
            form.newPassword && value.length < passwordMinLength 
            ? 'Enter current password to confirm password change' 
            : null),
        newPassword: (value) => (
           value && value.length < passwordMinLength 
           ? `New password must be at least ${passwordMinLength} chars`
           : null
        )
    };

    const handleConfirm = () =>{
        const newErrors = Object.entries(form).reduce((acc, [field, value]) => {
            const error = validatorsStrategy[field](value);
            if (error) acc[field] = error;
            return acc;
        }, {});

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log('sending put request!');
        setUser(prev =>({...prev, name: form.name, mail: form.mail}));
        setErrors({});
        setIsEditing(false);
    };
    
    const handleCancel = () =>{
        setIsEditing(false);
    };
    
    const handleChange = (e) =>{
        const field = e.target.name;
        setForm(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return(
        <div className="user-editing">
            <ul>
                <li>
                    Name: <input name="name" type="text" value={form.name} onChange={handleChange}></input>
                </li>
                {errors.name && <span className="error">{errors.name}</span>}
                <li>
                    Mail: <input name="mail" type="mail" value={form.mail} onChange={handleChange}></input>
                </li>
                {errors.mail && <span className="error">{errors.mail}</span>}
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