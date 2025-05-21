import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Invalid login or password");
      }
      const { token, user } = await res.json();
      localStorage.setItem("token", token);
      setUser(user);
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

    if(loading) return <div>Loading...</div>;

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username or Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <span onClick={() => navigate("/Register")}>
          Don't have an account?
        </span>
      </form>
    </div>
  );
}
