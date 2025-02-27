import React from "react";
import { Card } from "react-bootstrap";
import "./MedicineCard.css";
import { BsCart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import { cartRequest, cartSuccess, cartFail } from "../../Redux/cartSlice";

const MedicineCard = ({ medicine, link }) => {
  const {
    _id,
    name,
    price,
    discount,
    description,
    image,
    category,
    form,
    stock, // Stock information
  } = medicine;
  
  // Get current user from Redux (or context)
  const user = useSelector((state) => state?.auth?.user) || {};
  const dispatch = useDispatch();

  const discountedPrice = discount
    ? (price - price * (discount / 100)).toFixed(2)
    : price;

  const fileName = image?.split("\\").pop();
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}medicineImages/${fileName}`
    : "/media/default-medicine.png";

  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    try {
      dispatch(cartRequest());
      const res = await instance.post(
        "/cart/add",
        {
          userId: user.id,
          medicineId: _id,
          quantity: 1,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        // Dispatch success action with updated cart data
        dispatch(cartSuccess(res.data.data));
      } else {
        dispatch(cartFail(res.data.message));
      }
    } catch (error) {
      dispatch(cartFail(error.response?.data?.message || error.message));
    }
  };

  return (
    <a href={link} className="medicine-link">
      <Card className="medicine-card h-100">
        <div className="medicine-image-wrapper">
          <Card.Img variant="top" src={imageUrl} alt={name} className="medicine-img" />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="medicine-name">{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted medicine-category">
            {category} | {form}
          </Card.Subtitle>
          <Card.Text className="medicine-description">
            {description.length > 80 ? description.substring(0, 80) + "..." : description}
          </Card.Text>

          {/* Stock Information */}
          <div className="medicine-stock-info">
            {stock > 0 ? (
              <span className="in-stock">In Stock ({stock})</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {/* Price and Cart Button */}
          <div className="mt-auto medicine-price-info">
            <div>
              {discount ? (
                <>
                  <span className="medicine-price-discounted">${discountedPrice}</span>
                  <span className="medicine-price-original">${price.toFixed(2)}</span>
                </>
              ) : (
                <span className="medicine-price">${price.toFixed(2)}</span>
              )}
            </div>

            {/* Cart Button */}
            {stock > 0 && (
              <button className="medicine-add-to-cart" onClick={handleAddToCart}>
                <BsCart className="cart-icon" size={24} />
                <span className="cart-text">Add to cart</span>
              </button>
            )}
          </div>
        </Card.Body>
      </Card>
    </a>
  );
};

export default MedicineCard;
