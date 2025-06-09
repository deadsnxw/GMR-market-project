import "../styles/Balance.css"
import {useContext} from "react";
import UserContext from "../context/UserContext";
import {api} from "../services/api"

export default function Balance() {
    const {user, setUser} = useContext(UserContext);

    const handleReplenish = async (earn) => {
        try {
            const balanceData = await api.updateBalance(user.id, {earn});
            setUser(prev => ({...prev, balance: balanceData.newBalance}));
        } catch (error) {
            console.error("Updating error:", error);
        }
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