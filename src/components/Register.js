import "../styles/Login.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const validateInputs = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required.";
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required.";
        if (!password.trim() || password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        return newErrors;
    };

    const handleRegister = (event) => {
        event.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            if (!isChecked) {
                console.log("User registered.");
            } else {
                console.log("Seller registered.");
            }
        }
    };

    return (
        <div className="register">
            <h1>Register</h1>
            <form>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="error">{errors.username}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}

                <button onClick={(event) => handleRegister(event)}>Register</button>

                <div>
                    <input
                        type="checkbox"
                        id="terms"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="terms">I'm a seller</label>
                </div>

                <span onClick={() => navigate("/Login")}>Already have an account ?</span>
            </form>
        </div>
    );
}