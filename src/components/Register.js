import "../styles/Login.css";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const handleRegister = () => {
        // register logic
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Username"/>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <button type="submit" onClick={() => handleRegister()}>Register</button>
                <span onClick={() => navigate("/Login")}>Already have an account ?</span>
            </form>
        </div>
    )
}