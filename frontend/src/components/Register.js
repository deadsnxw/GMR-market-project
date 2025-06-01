import "../styles/Login.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Validator from "../validator/Validator";
import {api} from "../services/api";

export default function Register() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        isShop: false
    });

    const validator = new Validator()
        .addStrategy('username', Validator.required("Username is required"))
        .addStrategy('username', Validator.maxLength(16, "Username must be less than 16 characters"))
        .addStrategy('email', Validator.email("Valid email is required"))
        .addStrategy('password', Validator.minLength(6, "Password must be at least 6 characters"));

    const handleCheckboxChange = (event) => {
        setForm({ ...form, isShop: event.target.checked });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        const { isValid, errors } = validator.validateForm(form);

        if (!isValid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        try {
            await api.register(form);
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            setErrors({general: "Registration failed. Please try again."});
        }
    }


    return (
        <div className="register">
            <h1>Register</h1>
            <form>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                />
                {errors.username && <p className="error">{errors.username}</p>}

                <input
                    type="email"
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

                <button onClick={(event) => handleRegister(event)}>Register</button>

                <div>
                    <input
                        type="checkbox"
                        name="isShop"
                        id="terms"
                        checked={form.isShop}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="terms">I'm a seller</label>
                </div>
                {errors.general && <p className="error">{errors.general}</p>}
                <span onClick={() => navigate("/Login")}>Already have an account ?</span>
            </form>
        </div>
    );
}