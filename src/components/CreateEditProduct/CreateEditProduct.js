import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageComponent from "./ImageComponent";
import TagComponent from "./TagComponent";
import Validator from "../../validator/Validator";
import "../../styles/CreateEditProduct.css";

const productTags = ["electronics", "clothing", "home", "kitchen", "furniture", "smartphone", "laptop", "headphones", "wearable", "gadget", "men", "women", "kids", "summer", "winter", "appliances", "decor", "cookware", "utensils", "storage", "sports", "outdoor", "fitness", "beauty", "skincare", "organic", "sustainable", "luxury", "budget", "premium", "new", "sale", "bestseller", "limited"];

export default function CreateEditProduct({ isEditing = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    images: [],
    name: "",
    description: "",
    amount: "",
    price: "",
    tags: [],
  });
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
    if (isEditing) {
      fetch("/product.json")
        .then((res) => res.json())
        .then((data) => {
          setForm(data);
          setLoading(false);
        });
      
      // fetch(`/api/product/${productId}`)
      //   .then((response) => {
      //       if (!response.ok) {
      //           throw new Error('Server error');
      //       }
      //       return response.json()})
      //   .then((data) => {
      //       setForm(data);
      //       setLoading(false);
      //   })
      //   .catch(error => {
      //       console.error('Error:', error);
      //       setLoading(false);
      //   });
    }
  }, [isEditing]);

  const handleImageUpload = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length === 0) return;

    const remainingSlots = 6 - form.images.length;
    if (remainingSlots <= 0) return;

    const filesToUpload = imageFiles.slice(0, remainingSlots);

    filesToUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!form.images.includes(e.target.result)) {
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, e.target.result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    // fetch(`/api/product/${productId}`, {
    //     method: 'DELETE',
    // })
    // .then((response) => {
    //     if (!response.ok) {
    //         throw new Error('Server error');
    //     }
    //     navigate(`/me`);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors } = validator.validateForm(form);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    setErrors({});
    if(isEditing){
      // fetch(`/api/product/${productId}`, {
      //     method: 'PATCH',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(form)
      // })
      // .then((response) => {
      //     if (!response.ok) {
      //         throw new Error('Server error');
      //     }
      //     navigate(`/product/${productId}`)
      // })
      // .catch(error => {
      //     console.error('Error:', error);
      // });
    } else {
      // fetch(`/api/create `, {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(form)
      // })
      // .then((response) => {
      //     if (!response.ok) {
      //         throw new Error('Server error');
      //     }
      //     navigate(`/me`)
      // })
      // .catch(error => {
      //     console.error('Error:', error);
      // });
    }
    console.log(isEditing ? "Updating product" : "Creating product");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form className="create-product" onSubmit={handleSubmit}>
      <h1>{isEditing ? "Edit" : "Create"} Product</h1>

      <div className="image-upload">
        <p>Product images (max 6):</p>
        <div className="image-preview">
          {form.images.map((img) => (
            <ImageComponent key={img} setForm={setForm} image={img} />
          ))}
        </div>

        {form.images.length < 6 && (
          <label
            className="upload-area"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleImageUpload(e.dataTransfer.files);
              }
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              style={{ display: "none" }}
            />
            Drag & drop images here or click to select
          </label>
        )}
        {errors.images && <div className="error">{errors.images}</div>}
      </div>

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
