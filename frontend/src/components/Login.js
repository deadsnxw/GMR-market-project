import "../styles/Login.css";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    const handleLogin = () => {
        setLoading(true);
        fetch("/user.json")
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
                setLoading(false);
            });
    }

    if(loading) return <div>Loading...</div>

    return (
        <div className="login">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <button type="submit" onClick={handleLogin}>Login</button>
                <span onClick={() => navigate("/Register")}>Don't have an account ?</span>
            </form>
        </div>
    )
}