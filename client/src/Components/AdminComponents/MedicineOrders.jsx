import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Button, Table, Collapse, Dropdown, Row, Col, Modal } from "react-bootstrap";
import { FaBox, FaCheckCircle, FaChevronDown, FaChevronUp, FaCircle, FaShippingFast, FaSync } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import { ordersFetchFailure, ordersFetchSuccess, setOrderStatus, startFetchingOrders } from "../../Redux/allOrders";
import { convertISODate } from "../../Utils/dateUtils";
import { toast } from "react-toastify";
import Loading from "../../Pages/Others/Loading";
import "./MedicineOrder.css"; // Import external CSS

const statusConfig = {
  Pending: { color: "#FFB800", icon: <FaCircle /> },
  Confirmed: { color: "#0066FF", icon: <FaBox /> },
  Shipped: { color: "#00C2FF", icon: <FaShippingFast /> },
  Delivered: { color: "#00C2FF", icon: <FaCheckCircle /> },
  Cancelled: { color: "#FF3B3B", icon: <FaCircle /> }
};

const MedicineOrders = () => {
  const dispatch = useDispatch();
  const { ordersData, isLoading, error } = useSelector((state) => state.adminOrderData);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusChangedTo,setChangedStatus] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const fetchAdminOrders = useCallback(async () => {
    dispatch(startFetchingOrders());
    try {
      const res = await instance.get("/order/getAll", { withCredentials: true });
      if (res.data.success) {
        dispatch(ordersFetchSuccess(res.data));
      } else {
        dispatch(ordersFetchFailure(res.data.message));
      }
    } catch (error) {
      dispatch(ordersFetchFailure(error.message));
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  const handleStatusChange = (order,status) => {
    console.log('ORDER',status);
    
    setChangedStatus(status)
    setSelectedOrder(order);
    setShowModal(true);
  };

  const confirmStatusChange = async (newStatus) => {
    try {
      const res = await instance.put(`/order/status/${selectedOrder._id}`, { status: newStatus }, { withCredentials: true });
      if (res.data.success) {
        dispatch(setOrderStatus({ orderId: selectedOrder._id, newStatus }));
        toast.success("Order status updated");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
    setShowModal(false);
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  return (
    <Container fluid className="px-lg-4 py-3 medicine-orders-container">
      <Row className="align-items-center mb-4 g-3">
        <Col>
          <h2 className="mb-0  text-primary-dark">Medicine Orders</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="light" 
            onClick={fetchAdminOrders}
            className="text-muted-hover d-inline-flex align-items-center gap-2"
          >
            <FaSync /> Refresh
          </Button>
        </Col>
      </Row>

      {ordersData.list?.length ? ordersData.list.map((order) => {
        return (
          <Card key={order._id} className="border-0 shadow-xs-hover mb-3">
            <Card.Header className="p-3 bg-white cursor-pointer">
              <Row className="align-items-center gx-4 gy-2">
                <Col xs={12} md={3}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="status-icon-container" style={{ backgroundColor: statusConfig[order.status].color + '15' }}>
                      {React.cloneElement(statusConfig[order.status].icon, { color: statusConfig[order.status].color, size: 18 })}
                    </div>
                    <div>
                      <div className="text-muted small">Order ID</div>
                      <div className="fw-600">#{order.orderId}</div>
                    </div>
                  </div>
                </Col>
                
                <Col xs={6} md={2}>
                  <div className="text-muted small">Date</div>
                  <div>{convertISODate(order.orderDate)}</div>
                </Col>
                
                <Col xs={6} md={2}>
                  <div className="text-muted small">Customer</div>
                  <div>{order.userId?.name || "Guest"}</div>
                </Col>
                
                <Col xs={6} md={2}>
                  <div className="text-muted small">Total</div>
                  <div className="fw-600">₹{order.totalPrice.toFixed(2)}</div>
                </Col>
                
                <Col xs={6} md={2}>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="status-dropdown-toggle" disabled={["Delivered,Shipped,Cancelled"].includes(order.status)} >
                      <span style={{ color: statusConfig[order.status].color }}>
                        {order.status}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="status-dropdown-menu">
                      {Object.keys(statusConfig).map((status) => (
                        <Dropdown.Item 
                          key={status} 
                          onClick={() => handleStatusChange(order,status)}
                          className="d-flex align-items-center gap-2 py-2"
                        >
                          {React.cloneElement(statusConfig[status].icon, { color: statusConfig[status].color, size: 14 })}
                          {status}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                
                <Col xs={12} md={1} className="text-end">
                  <Button 
                    variant="link" 
                    className="p-0 text-dark"
                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                  >
                    {expandedOrderId === order._id ? <FaChevronUp /> : <FaChevronDown />}
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            
            <Collapse in={expandedOrderId === order._id}>
              <div className="p-3 bg-light-100 overflow-x-scroll">
                <Table borderless className="mb-0">
                  <thead className="bg-light-200">
                    <tr>
                      <th>Medicine</th>
                      <th className="text-end">Quantity</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.medicines.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-light-200 rounded p-2">
                              <FaBox className="text-muted" />
                            </div>
                            {item.medicineId.name}
                          </div>
                        </td>
                        <td className="text-end">x{item.quantity}</td>
                        <td className="text-end">₹{item.amount.toFixed(2)}</td>
                        <td className="text-end fw-600">₹{(item.itemTotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>

                </Table>
                <div className="mt-3 p-2 border-top">
                  <Row className="justify-content-end">
                    <Col xs={6} md={2} lg={2} className="text-muted text-end">Subtotal:</Col>
                    <Col xs={6}  md={2} lg={2} className="text-end fw-600">₹{order.totalPrice.toFixed(2)}</Col>
                  </Row>
                  
                  <Row className="justify-content-end">
                    <Col xs={6} md={3} lg={2}className="text-muted text-end">Total Price:</Col>
                    <Col xs={6} md={2} lg={2} className="text-end fw-700">₹{order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </div>
              </div>
            </Collapse>
          </Card>
        );
      }) : <div className="text-center py-5"><h4>No orders found</h4></div>}
       <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modern-modal">
             <Modal.Body className="p-4">
               <div className="text-center mb-4">
                 <div className="mb-3">
                   <FaCheckCircle className="text-primary" size={40} />
                 </div>
                 <h5>Confirm Status Change</h5>
                 <p className="text-muted mb-0">
                   Change status for order #{selectedOrder?.orderId} to {statusChangedTo}?
                 </p>
               </div>
               <div className="d-flex gap-3">
                 <Button 
                   variant="light" 
                   onClick={() => setShowModal(false)}
                   className="w-100 border"
                 >
                   Cancel
                 </Button>
                 <Button 
                   variant="primary" 
                   onClick={() => confirmStatusChange(statusChangedTo)} 
                   className="w-100"
                 >
                   Confirm
                 </Button>
               </div>
             </Modal.Body>
           </Modal>
    </Container>
  );
};

export default MedicineOrders;
