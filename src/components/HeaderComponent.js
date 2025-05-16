import "../styles/HeaderComponent.css"
import userContext from "../context/UserContext";
import {useContext} from "react";

export default function HeaderComponent() {
    const {user} = useContext(userContext);

    return (
        <header className="header">
            <div className="logo" onClick={() => window.location.href = '/'}>
                <img src="/logo192.png" alt="Logo"/>
            </div>
            <nav className="nav">
                <img src={"/userpic.png"}
                     alt="User"
                     className="user-pic"
                     onClick={
                    () =>  window.location.href = '/me'}/>
            </nav>
        </header>
    )
}