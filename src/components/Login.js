import "../styles/Login.css";

export default function Login() {
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
            </form>
        </div>
    )
}