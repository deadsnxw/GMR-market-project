import "../styles/Login.css";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // login logic
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <button type="submit" onClick={() => handleLogin()}>Login</button>
                <span onClick={() => navigate("/Register")}>Don't have an account ?</span>
            </form>
        </div>
    )
}