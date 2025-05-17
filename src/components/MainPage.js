import "../styles/MainPage.css";
import { useState } from "react";

export default function MainPage() {
    const tags = ["Electronics", "Fashion", "Home & Garden", "Sports", "Toys"];
    const [products, setProducts] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setProducts((prev) => [...prev, value]);
        } else {
            setProducts((prev) => prev.filter((tag) => tag !== value));
        }
    };

    return (
        <div className="main-page">
            <div className="left-panel">
                <div className="left-panel-header">
                    <h2>Categories</h2>
                </div>
                <div className="left-panel-content">
                    <ul>
                        {tags.map((category, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={category}
                                        onChange={handleCheckboxChange}
                                    />
                                    {category}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="main-panel"></div>
        </div>
    );
}