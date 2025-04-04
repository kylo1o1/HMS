import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Table, Modal } from "react-bootstrap";
import { FaClock, FaCheckCircle, FaTimesCircle, FaBox, FaTrash } from "react-icons/fa";
import Loading from "../Others/Loading";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import { fetchOrdersFailure, fetchOrdersStart, fetchOrdersSuccess, updateOrderList } from "../../Redux/ordersSlice";
import { toast } from "react-toastify";
import { convertISODate } from "../../Utils/dateUtils";
import "./OrderHistory.css";

const OrderHistory = () => {
  const { orders, loading } = useSelector((state) => state?.ordersData);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [medicineId, setMedicineId] = useState(null);
  const [cancelAll, setCancelAll] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(fetchOrdersStart());
      try {
        const res = await instance.get("/order/user", { withCredentials: true });
        if (res.data.success) {
          dispatch(fetchOrdersSuccess(res.data.data));
        } else {
          dispatch(fetchOrdersFailure(res.data.message));
          toast.error(res.data.message);
        }
      } catch (error) {
        dispatch(fetchOrdersFailure(error.message));
        toast.error("Failed To Load Orders" || error.message);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelItem = async () => {
    try {
      const res = await instance.put("/order/cancelItem", { orderId, medicineId }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Item Cancelled");
        dispatch(updateOrderList(res.data.data));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed To Cancel Item" || error.message);
    }
  };

  const handleCancelOrder = async () => {
    try {
      
      const res = await instance.put(`/order/cancel/${orderId}`,{},{withCredentials:true});
      if (res.data.success) {
        toast.success("Order Cancelled");
        dispatch(updateOrderList(res.data.data.cart));
      } else {
        throw new Error(res.data.message);
        
      }
    } catch (error) {
      toast.error("Failed To Cancel Order" || error.message);
    }
  };

  const openCancelModal = (orderId, itemId = null, cancelAll = false) => {
    setOrderId(orderId);
    setMedicineId(itemId);
    setCancelAll(cancelAll);
    setShowModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheckCircle className="text-success" />;
      case "Cancelled":
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaClock className="text-warning" />;
    }
  };

  if (loading) return <Loading />;

  return (
    <Container className="order-history-container">
      <h2 className="history-header mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <FaBox size={64} className="text-muted mb-3" />
          <h4>No orders found</h4>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="order-card mb-4 shadow-xs-hover">
            <Card.Body>
              <Row className="align-items-center justify-content-between mb-3">
                <Col xs={12} md={4}>
                  <div className="d-flex align-items-center gap-2">
                    {getStatusIcon(order.status)}
                    <h5 className="mb-0"> #{order.orderId}</h5>
                    <Badge className={`status-${order.status.toLowerCase()}`}>{order.status}</Badge>
                  </div>
                  <small>Ordered on {convertISODate(order.orderDate)}</small>
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                  <h5>Total: ₹{order.totalPrice.toFixed(2)}</h5>
                  <small>{order.medicines.length} items</small>
                </Col>
              </Row>

              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order.medicines.map((item) => (
                    <tr key={item._id}>
                      <td>{item.medicineId.name}</td>
                      <td>x{item.quantity}</td>
                      <td>₹{item.amount.toFixed(2)}</td>
                      <td>
                        {order.status === "Pending" && (
                          <Button size="sm" variant="outline-danger" onClick={() => openCancelModal(order._id, item.medicineId._id)}>
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {order.status === "Pending" && (
                <Button variant="danger" size="sm" onClick={() => openCancelModal(order._id, null, true)}>
                  <FaTrash /> Cancel Entire Order
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel {cancelAll ? 'this entire order' : 'this item'}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
          <Button variant="danger" onClick={cancelAll ? handleCancelOrder : handleCancelItem}>Yes, Cancel</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderHistory;
