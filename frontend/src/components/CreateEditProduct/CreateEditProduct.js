import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageFieldComponent from "./ImageFieldComponent";
import TagComponent from "./TagComponent";
import Validator from "../../validator/Validator";
import UserContext from "../../context/UserContext"
import {api} from "../../services/api"
import "../../styles/CreateEditProduct.css";

export default function CreateEditProduct({ isEditing = false }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { productId } = useParams();
  const [form, setForm] = useState({
    images: [],
    name: "",
    description: "",
    amount: "",
    price: "",
    tags: [],
  });
  const [productTags, setProductTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);

  const validator = new Validator()
  .addStrategy('images', Validator.required("Add at least one image"))
  .addStrategy('name', Validator.minLength(4, "Name must be at least 4 characters"))
  .addStrategy('name', Validator.maxLength(30, "Name must be no more than 30 characters"))
  .addStrategy('description', Validator.minLength(15, "Description must be at least 15 characters"))
  .addStrategy('amount', value => !Number.isInteger(Number(value)) || value <= 0 ? "Enter valid amount" : null)
  .addStrategy('price', value => isNaN(value) || value <= 0 || /\.\d{3,}$/.test(value) ? "Enter valid price" : null)
  .addStrategy('tags', Validator.required("Select at least one tag"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagData = await api.getTags();
        setProductTags(tagData);

        if (isEditing) {
          const productData = await api.getProduct(productId);
          setForm(productData);
        }

      } catch (error) {
        console.error("Fetching error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      await api.deleteProduct(productId);
      navigate("/me");
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validator.validateForm(form);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    setErrors({});
    if(isEditing){
      try {
        await api.updateProduct(productId, form);
        navigate(`/product/${productId}`);
      } catch (error) {
        console.error("Updating failed:", error);
      }
    } else {
      try {
        await api.createProduct({...form, userId: user.id});
        navigate("/me");
      } catch (error) {
        console.error("Creating failed:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form className="create-product" onSubmit={handleSubmit}>
      <h1>{isEditing ? "Edit" : "Create"} Product</h1>

      <ImageFieldComponent images={form.images} setForm={setForm} error={errors.images}/>

      <div className="form-group">
        <label>Product Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter product name"
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter product description"
        />
        {errors.description && (
          <div className="error">{errors.description}</div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Amount</label>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
          {errors.amount && <div className="error">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tags-container">
          {productTags.map((name) => (
            <TagComponent
              key={name}
              tags={form.tags}
              setForm={setForm}
              name={name}
            />
          ))}
        </div>
        {errors.tags && <div className="error">{errors.tags}</div>}
      </div>

      <div className="form-actions">
        {isEditing && (
          <button
            type="button"
            className="btn-delete"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate("/me")}
        >
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {isEditing ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}
