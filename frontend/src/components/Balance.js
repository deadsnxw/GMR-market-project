import "../styles/Balance.css"
import {useState, useContext, useEffect} from "react";
import UserContext from "../context/UserContext";

export default function Balance() {
    const {user, setUser} = useContext(UserContext);
    const [balance, setBalance] = useState(user.balance);

    useEffect(() => {
        setBalance(user.balance);
    }, [user.balance]);

    const handleReplenish = (money) => {
        const newBalance = balance + money;
        setBalance(newBalance);
        setUser(prev => ({ ...prev, balance: newBalance }));
        console.log(`Replenished: $${money}, New Balance: $${newBalance}`);
    }

    return (
        <div className="balance">
            <div className="ten-card">
                <span>$10</span>
                <button onClick={() => handleReplenish(10)}>Replenish</button>
            </div>
            <div className="fifty-card">
                <span>$50</span>
                <button onClick={() => handleReplenish(50)}>Replenish</button>
            </div>
            <div className="hundred-card">
                <span>$100</span>
                <button onClick={() => handleReplenish(100)}>Replenish</button>
            </div>
        </div>
    )
}