import React from "react";
import { Button, Col, Container, Row, Image, Card } from "react-bootstrap";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../../Redux/cartSlice";
import instance from "../../Axios/instance";
import Loading from "../Others/Loading";
import "./MedicineCart.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CartItem = ({ item, index, updateQuantity, handleRemove }) => {
  const fileName = item?.medicineId.image?.split("\\").pop();
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}medicineImages/${fileName}`
    : "/media/default-medicine.png";

  return (
    <>
      {/* ✅ Desktop View */}
      <Row className="d-none d-md-flex cart-item align-items-center py-3 border-bottom">
        <Col md={1}>{index + 1}</Col>
        <Col md={3} className="d-flex align-items-center">
          <Image
            src={imageUrl}
            rounded
            className="me-2 cart-image"
            width={50}
            height={50}
            alt={item?.medicineId?.name}
          />
          <span>{item?.medicineId?.name}</span>
        </Col>
        <Col md={2}>{item.medicineId.form || "N/A"}</Col>
        <Col md={2}>₹ {Number(item.amount).toFixed(2)}</Col>
        <Col md={2}>
          <div className="quantity-controls">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() =>
                updateQuantity(item.medicineId._id, item.quantity, "decrease")
              }
              disabled={item.quantity <= 1}
            >
              <FaMinus />
            </Button>
            <span className="quantity">{item.quantity}</span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() =>
                updateQuantity(item.medicineId._id, item.quantity, "increase")
              }
            >
              <FaPlus />
            </Button>
          </div>
        </Col>
        <Col md={1}>₹ {Number(item.itemTotal).toFixed(2)}</Col>
        <Col md={1}>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleRemove(item.medicineId._id)}
          >
            <FaTrash />
          </Button>
        </Col>
      </Row>

      {/* ✅ Mobile View */}
      <Card className="d-md-none mb-3">
        <Card.Body>
          <div className="d-flex">
            <Image
              src={imageUrl}
              rounded
              width={60}
              height={60}
              alt={item?.medicineId?.name}
            />
            <div className="ms-3">
              <h6 className="mb-1">{item?.medicineId?.name}</h6>
              <p className="mb-1 text-muted">
                Form: {item.medicineId.form || "N/A"}
              </p>
              <p className="mb-1 text-muted">
                Price: ₹{Number(item.amount).toFixed(2)}
              </p>
              <p className="mb-1 text-muted">
                Total: ₹{Number(item.itemTotal).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <div className="quantity-controls">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() =>
                  updateQuantity(item.medicineId._id, item.quantity, "decrease")
                }
                disabled={item.quantity <= 1}
              >
                <FaMinus />
              </Button>
              <span className="quantity">{item.quantity}</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() =>
                  updateQuantity(item.medicineId._id, item.quantity, "increase")
                }
              >
                <FaPlus />
              </Button>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemove(item.medicineId._id)}
            >
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

const MedicineCart = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cartSl);
  const { medicines, subtotal, discount, grandTotal } = cart;
  const user = useSelector((state) => state.auth.user);

  // ✅ Function to Update Quantity (Increase/Decrease)
  const updateQuantity = async (id, quantity, type) => {
    try {
      const updatedQuantity =
        type === "increase" ? quantity + 1 : quantity - 1;
      const res = await instance.patch(
        `/cart/update/${id}`,
        { quantity: updatedQuantity },
        { withCredentials: true }
      );
      console.log(res);
      

      if (res.data.success) {
        dispatch(
          updateItemQuantity({
            medicineId: id,
            quantity: updatedQuantity,
            amount: res.data.amount,
            itemTotal: res.data.itemTotal,
          })
        );
      }else{
        
        throw new Error(res.data.message);
        
      }
    } catch (error) {
      toast.error(error.message || "Failed To Update Quantity");
    }
  };

  // ✅ Function to Remove Item
  const handleRemove = async (id) => {
    try {
      const res = await instance.delete(`/cart/remove/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(removeItemFromCart(id));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // ✅ Handle Checkout Function
  const handleCheckout = async () => {
    try {
      const res = await instance.post(
        "/order/place",
        { userId: user.id, paymentMethod: "Online" },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Order has been Placed");
        dispatch(clearCart());
      }
    } catch (error) {
      toast.error("Failed To Place Order");
    }
  };

  return (
    <Container className="medicine-cart">
      <h2 className="mb-4 text-center">Your Cart ({medicines.length} items)</h2>

      {loading && <Loading />}

      {medicines.length > 0 ? (
        <>
          {/* ✅ Header for Desktop */}
          <Row className="d-none d-md-flex cart-header py-2 border-bottom">
            <Col md={1}>#</Col>
            <Col md={3}>Item</Col>
            <Col md={2}>Form</Col>
            <Col md={2}>Price</Col>
            <Col md={2}>Quantity</Col>
            <Col md={1}>Total</Col>
            <Col md={1}>Action</Col>
          </Row>

          {medicines.map((item, index) => (
            <CartItem
              key={item.medicineId._id}
              item={item}
              index={index}
              updateQuantity={updateQuantity}
              handleRemove={handleRemove}
            />
          ))}

          {/* ✅ Cart Summary */}
          <Row className="justify-content-end pt-3">
            <Col xs={12} md={4}>
              <h5>Subtotal: ₹ {subtotal.toFixed(2)}</h5>
              <h6 className="text-danger">Discount: -₹ {discount.toFixed(2)}</h6>
              <h5>Grand Total: ₹ {grandTotal.toFixed(2)}</h5>
              <Button className="w-100 mt-2" onClick={handleCheckout}>
                Checkout
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <div className="empty-cart text-center">
          <FaShoppingCart size={60} className="text-muted mb-3" />
          <h4>Your cart is empty</h4>
          <Link to="/medicineList">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default MedicineCart;
