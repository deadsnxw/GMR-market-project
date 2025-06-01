import "../styles/MainPage.css";
import React, {useState, useEffect} from "react";
import ProductCard from "./ProductCard";
import {api} from "../services/api";

export default function MainPage() {
    const [productTags, setProductTags] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mainData = await api.getMain({tags: productTags});
                setProducts(mainData.products);
                setTags(mainData.tagList);
                setLoading(false);
            } catch (error) {
                console.error("Fetching error:", error);
                setLoading(false);
            }
        }
        fetchData();
    }, [productTags]);

    const handleCheckboxChange = (event) => {
        const {value, checked} = event.target;
        if (checked) {
            setProductTags((prev) => [...prev, value]);
        } else {
            setProductTags((prev) => prev.filter((tag) => tag !== value));
        }
    };

    if (loading) return <div>Loading...</div>

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
            <div className="main-panel">
                {products.map(product => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
    );
}