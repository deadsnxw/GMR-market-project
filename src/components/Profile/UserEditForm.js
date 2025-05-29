import React, {useState, useContext} from "react";
import UserContext from "../../context/UserContext";
import "../../styles/UserEditForm.css";
import Validator from "../../validator/Validator";

export default function UserEditForm ({ setIsEditing }){
    const {user, setUser} = useContext(UserContext);

    const [form, setForm] = useState({
        name: user.name,
        mail: user.mail,
        password: '',
        newPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validator = new Validator()
    .addStrategy('name', Validator.minLength(1, 'Username must be at least 1 character'))
    .addStrategy('name', Validator.maxLength(16, 'Username must ba less than 16 character'))
    .addStrategy('mail', Validator.email('Enter valid mail'))
    .addStrategy('newPassword', value => value && value.length < 6 ? `New password must be at least 6 characters` : null)
    .addStrategy('password', value => form.newPassword && value.length < 6 ? 'Enter current password to confirm password change' : null)

    const handleConfirm = () =>{
        const { isValid, errors } = validator.validateForm(form);
  
        if (!isValid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        // fetch(`/api/user/${user.id}`, {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(form)
        // })
        // .then((response) => {
        //     if (!response.ok) {
        //         throw new Error('Server error');
        //     }
        //     setUser(prev => ({...prev, name: form.name, mail: form.mail}));
        //     setIsEditing(false);
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });
        console.log('sending patch request!');
        setUser(prev => ({...prev, name: form.name, mail: form.mail}));
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