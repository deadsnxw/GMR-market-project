import "../styles/Login.css";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext";
import Validator from "../validator/Validator";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const validator = new Validator()
        .addStrategy('email', Validator.email("Valid email is required"))
        .addStrategy('password', Validator.minLength(6, "Password must be at least 6 characters"));

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (event) => {
        event.preventDefault();

        const { isValid, errors } = validator.validateForm(form);

        if (!isValid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( form ),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            setUser(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    // const handleLogin = (event) => {
    //     event.preventDefault();

    //     const { isValid, errors } = validator.validateForm(form);

    //     if (!isValid) {
    //         setErrors(errors);
    //         return;
    //     }

    //     setErrors({});
    //     fetch("/user.json")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setUser(data);
    //         });
    // }

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                    {errors.email && <p className="error">{errors.email}</p>}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />
                    {errors.password && <p className="error">{errors.password}</p>}

                <button type="submit">Login</button>
                <span onClick={() => navigate("/Register")}>Don't have an account ?</span>
            </form>
        </div>
    )
}