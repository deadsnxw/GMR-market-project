import "../styles/Login.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function Register() {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    }

    const handleRegister = (event) => {
        event.preventDefault();
        if (!isChecked) {
            console.log("User registered.")
        } else {
            console.log("Seller registered.")
        }
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Username"/>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <button onClick={(event) => handleRegister(event)}>Register</button>
                <div>
                    <input type="checkbox" id="terms" checked={isChecked} onChange={handleCheckboxChange}/>
                    <label htmlFor="terms">I'm a seller</label>
                </div>
                <span onClick={() => navigate("/Login")}>Already have an account ?</span>
            </form>
        </div>
    )
}