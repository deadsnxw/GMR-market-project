import "../styles/HeaderComponent.css"
import userContext from "../context/UserContext";
import {useContext} from "react";

export default function HeaderComponent() {
    const {user} = useContext(userContext);
    const balance = user ? user.balance ?? 0 : null;

    return (
        <header className="header">
            <div className="logo" onClick={() => window.location.href = '/'}>
                <img src="/logo192.png" alt="Logo"/>
            </div>
            <nav className="nav">
                {!user.isShop && user && balance !== null && <span onClick={() => window.location.href = '/balance'}>${balance}</span>}
                <img src={"/userpic.png"}
                     alt="User"
                     className="user-pic"
                     onClick={
                    () =>  window.location.href = '/me'}/>
            </nav>
        </header>
    )
}