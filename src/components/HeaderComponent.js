import "../styles/HeaderComponent.css"
import userContext from "../context/UserContext";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";

export default function HeaderComponent() {
    const {user, setUser} = useContext(userContext);
    const balance = user ? user.balance ?? 0 : null;
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate('/')}>
                <img src="/logo192.png" alt="Logo"/>
            </div>
            <nav className="nav">
                {!user.isShop && user && balance !== null && <span onClick={() => navigate('/balance')}>${balance}</span>}
                {user && <button onClick={() => setUser(null)}>Logout</button>}
                <img src={"/userpic.png"}
                     alt="User"
                     className="user-pic"
                     onClick={
                    () =>  navigate('/me')}/>
            </nav>
        </header>
    )
}