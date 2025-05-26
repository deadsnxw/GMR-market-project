import "../styles/Login.css";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setMail(value);
    }

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: mail,
                password: password,
            }),
        })

            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })

            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }

    if(loading) return <div>Loading...</div>

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email" value={mail} onChange={handleChange}/>
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
                <button type="submit">Login</button>
                <span onClick={() => navigate("/Register")}>Don't have an account ?</span>
            </form>
        </div>
    )
}
