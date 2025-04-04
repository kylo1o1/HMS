import React, { useState } from "react";
import { Card, Spinner, Modal, Button } from "react-bootstrap";
import "./MedicineCard.css";
import { BsCart, BsCheck2, BsCheckCircle, BsXCircle, BsEye } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import { cartRequest, cartSuccess, cartFail } from "../../Redux/cartSlice";
import { toast } from "react-toastify";

const MedicineCard = ({ medicine }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    _id,
    name,
    price,
    discount,
    description,
    image,
    category,
    form,
    stock,
  } = medicine;

  const user = useSelector((state) => state?.auth?.user) || {};
  const cartItems = useSelector((state) => state.cartSl.cart.medicines ?? []);
  const itemExist = cartItems.find((item) => item.medicineId._id === medicine._id);
  const dispatch = useDispatch();

  const discountedPrice = discount
    ? (price - price * (discount / 100)).toFixed(2)
    : price;

  const fileName = image?.split("\\").pop();
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}medicineImages/${fileName}`
    : "/media/default-medicine.png";

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      dispatch(cartRequest());
      const res = await instance.post(
        "/cart/add",
        {
          medicineId: _id,
          quantity: 1,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      
      if (res.data.success) {
        dispatch(cartSuccess(res.data.data.cart));
        toast.success("Added to cart successfully");
      } else {
        throw new Error(res.data.message);
        
      }
    } catch (error) {
      dispatch(cartFail(error.response?.data?.message || error.message));
      console.log(error.stack);
      
      toast.error( error.message|| "Failed To add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="medicine-card h-100">
        <div className="image-container">
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={name}
            className="medicine-image"
            onError={(e) => {
              e.target.src = "/media/default-medicine.png";
            }}
          />
          {discount > 0 && (
            <div className="discount-ribbon">
              <span>{discount}% OFF</span>
            </div>
          )}
        </div>

        <Card.Body className="card-content">
          <div className="category-tags">
            <span className="category-pill">{category}</span>
            <span className="form-pill">{form}</span>
          </div>

          <h3 className="medicine-title">{name}</h3>
          
          <p className="medicine-description">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description}
          </p>

          <div className="stock-status">
            {stock > 0 ? (
              <div className="in-stock">
                <BsCheckCircle className="status-icon" />
                <span>{stock} in stock</span>
              </div>
            ) : (
              <div className="out-of-stock">
                <BsXCircle className="status-icon" />
                <span>Out of stock</span>
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="price-section">
              {discount ? (
                <>
                  <span className="current-price">
                    ₹{discountedPrice}
                  </span>
                  <span className="original-price">
                    ₹{price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="current-price">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="quick-view-btn"
                onClick={() => setShowModal(true)}
                aria-label="Quick view"
              >
                <BsEye />
              </button>

              {stock > 0 && (
                <button
                  className={`add-to-cart-btn ${itemExist ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={itemExist || loading}
                  aria-label={itemExist ? "Added to cart" : "Add to cart"}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : itemExist ? (
                    <BsCheck2 className="cart-icon" />
                  ) : (
                    <BsCart className="cart-icon" />
                  )}
                </button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Enhanced Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="modal-image-container">
            <img 
              src={imageUrl} 
              alt={name} 
              className="modal-image"
            />
          </div>
          
          <div className="modal-details">
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{category}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Form:</span>
              <span className="detail-value">{form}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Price:</span>
              <span className="detail-value price-highlight">
                ₹{discountedPrice}
                {discount > 0 && (
                  <span className="price-discount">(-{discount}%)</span>
                )}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Availability:</span>
              <span className={`detail-value ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {stock > 0 ? `${stock} available` : 'Temporarily unavailable'}
              </span>
            </div>
          </div>

          <p className="full-description">{description}</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button 
            variant="secondary" 
            className="close-btn"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          {stock > 0 && (
            <Button
              variant="primary"
              className="modal-cart-btn"
              onClick={handleAddToCart}
              disabled={itemExist || loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : itemExist ? (
                <>
                  <BsCheck2 /> Added to Cart
                </>
              ) : (
                <>
                  <BsCart /> Add to Cart
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MedicineCard;
