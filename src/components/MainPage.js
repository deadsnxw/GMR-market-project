import "../styles/MainPage.css";
import React, {useState, useEffect} from "react";
import ProductCard from "./ProductCard";

export default function MainPage() {
    const tags = ["electronics", "clothing", "home", "kitchen", "furniture", "smartphone", "laptop", "headphones", "wearable", "gadget", "men", "women", "kids", "summer", "winter", "appliances", "decor", "cookware", "utensils", "storage", "sports", "outdoor", "fitness", "beauty", "skincare", "organic", "sustainable", "luxury", "budget", "premium", "new", "sale", "bestseller", "limited"];
    const [productTags, setProductTags] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({tags: products}),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                console.log("Fetched products:", data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

    }, [productTags]);

    useEffect(() => {
        fetch("/main.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                console.log("Fetched main data:", data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching main data:", error);
                setLoading(false);
            });
    }, []);

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