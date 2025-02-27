import React, { useEffect } from "react";
import { Button, Col, Container, Row, Image, Form, Card } from "react-bootstrap";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import "./MedicineCart.css";
import { useDispatch, useSelector } from "react-redux";
import { 
  clearCart, 
  removeItemFromCart, 
  updateItemQuantity, 
  cartSuccess 
} from "../../Redux/cartSlice";
import instance from "../../Axios/instance";
import Loading from "../Others/Loading";

const MedicineCart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cartSl);
  const { medicines, totalPrice, itemCount } = cart;
  const user = useSelector((state) => state.auth.user);

  // Fetch cart from backend on component mount (if user is logged in)
  

  const addQuantity = async (medicineId,qty,amount)=>{
    const newQty = qty  + 1;
    const payload = {
      userId:user.id,
      medicineId,
      quantity:newQty,
      amount
    }
    try {
      
      const res = await instance.patch('/cart/update',payload,{withCredentials:true})
      if(res.data.success){
        dispatch(updateItemQuantity(payload))
      }else{
        console.log(res.data.message);
      }

    } catch (error) {
      console.log(error.message);
    }
  }
  const subQuantity =  async(medicineId,qty,amount)=>{
    const newQty = qty  - 1;

    const payload = {
      userId:user.id,
      medicineId,
      quantity:newQty,
      amount
    }
    try {
      
      
      const res = await instance.patch('/cart/update',payload,{withCredentials:true})
      if(res.data.success){
        dispatch(updateItemQuantity(payload))
      }else{
        console.log(res.data.message);
      }
      if(newQty === 0){
        const res = await instance.delete('/cart/delete',{data:payload,withCredentials:true})
        if(res.data.success){
          console.log("item removed");
        }else{
          console.log(res.data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleRemove = async (medicineId) => {
    const payload = {
      userId:user.id,
      medicineId
    }
    try {
      const res = await instance.delete('/cart/delete',{data:payload,withCredentials:true})
      if(res.data.success){
        dispatch(removeItemFromCart(payload))
      }else{
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleClearCart = async () => {
    try {
      const payload  ={
        userId:user.id,
      }
      const res = await instance.post('/cart/clear',payload,{withCredentials:true})
      if(res.data.success){
        dispatch(clearCart())
      }else{
        console.log(res.data.message);
        
      }
    } catch (error) {
      console.log(error.message);
      
    }
  };

  return (
    <Container className="medicine-cart">
      <h2 className="mb-4">Your Cart ({itemCount} items)</h2>
      
      {loading && <Loading/>}
      {error && <p className="text-danger">{error}</p>}
      
      {medicines && medicines.length > 0 ? (
        <>
          <Row className="d-none d-md-flex cart-header align-items-center py-2 border-bottom">
            <Col md={1}><strong>#</strong></Col>
            <Col md={3}><strong>Item</strong></Col>
            <Col md={2}><strong>Form</strong></Col>
            <Col md={2}><strong>Price</strong></Col>
            <Col md={2}><strong>Quantity</strong></Col>
            <Col md={1}><strong>Total</strong></Col>
            <Col md={1}><strong>Action</strong></Col>
          </Row>

          {medicines.map((item, index) =>{
            const fileName = item?.medicineId.image?.split("\\").pop();
            const imageUrl = fileName
              ? `${process.env.REACT_APP_URL}medicineImages/${fileName}`
              : "/media/default-medicine.png";
              
           return (
            <Row key={item.medicineId._id} className="d-none d-md-flex cart-item align-items-center py-3 border-bottom">
              <Col md={1}>{index + 1}</Col>
              <Col md={3} className="d-flex align-items-center">
                <Image src={imageUrl} rounded className="me-2" width={50} height={50} alt={item.medicineId.name} />
                <span>{item.medicineId.name}</span>
              </Col>
              <Col md={2}>{item.medicineId.form || "N/A"}</Col>
              <Col md={2}>₹ {Number(item.amount).toFixed(2)}</Col>
              <Col md={2}>
              <div className="quantity-controls mt-1">
                      <Button variant="outline-secondary" size="sm" onClick={()=>subQuantity(item.medicineId._id,item.quantity,item.amount)} >
                        <FaMinus />
                      </Button>
                      <span className="quantity">{item.quantity}</span>
                      <Button variant="outline-secondary" size="sm" onClick={()=>addQuantity(item.medicineId._id,item.quantity,item.amount)} >
                        <FaPlus />
                      </Button>
                    </div>
              </Col>
              <Col md={1}>₹ {Number(item.itemTotal).toFixed(2)}</Col>
              <Col md={1}>
                <Button variant="danger" size="sm" onClick={() => handleRemove(item.medicineId._id)}>
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          )})}

          {/* Mobile Layout */}
          {medicines.map((item,index) => (
            <Row key={item.medicineId._id} className="d-md-none">
              <Col>
                <Card className="mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <Image src={item.medicineId.image || "/media/default-medicine.png"} rounded className="me-2" width={50} height={50} alt={item.medicineId.name} />
                      <Card.Title className="mb-0">{item.medicineId.name}</Card.Title>
                    </div>
                    <div>
                      <strong>Form:</strong> {item.medicineId.form || "N/A"}<br />
                      <strong>Price:</strong> ₹ {Number(item.amount).toFixed(2)}<br />
                      <strong>Quantity:</strong>
                      <div className="quantity-controls mt-1">
                      <Button variant="outline-secondary" size="sm" onClick={()=>subQuantity(item.medicineId._id,item.quantity,item.amount)} >
                        <FaMinus />
                      </Button>
                      <span className="quantity">{item.quantity}</span>
                      <Button variant="outline-secondary" size="sm" onClick={()=>addQuantity(item.medicineId._id,item.quantity,item.amount)}>
                        <FaPlus />
                      </Button>
                    </div>
                      <strong className="d-block mt-2">Total:</strong> ₹ {Number(item.itemTotal).toFixed(2)}
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <Button variant="danger" size="sm" onClick={() => handleRemove(item.medicineId)}>
                        <FaTrash /> Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))}
        

          <Row className="justify-content-end pt-3">
            <Col xs={12} md={4} className="d-flex flex-column align-items-end">
              <h5 className="mb-3">
                Grand Total: ₹ <span>{Number(totalPrice).toFixed(2)}</span>
              </h5>
              <Button variant="primary" size="lg">
                Checkout
              </Button>
              <Button variant="secondary" onClick={()=> handleClearCart()} className="mt-2">
                Clear Cart
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </Container>
  );
};

export default MedicineCart;
