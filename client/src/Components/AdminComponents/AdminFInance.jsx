import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Modal } from 'react-bootstrap';

import './AdminFinance.css';
import { faChartLine, faDollarSign, faFileInvoice, faIndianRupeeSign, faRupeeSign, faCalendarCheck, faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import instance from '../../Axios/instance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsSuccess } from '../../Redux/revenueSlice';
import { toast } from 'react-toastify';
import { selectAdminHomeData } from '../../Redux/selectors/adminSelector';
import { convertISODate } from '../../Utils/dateUtils';

const AdminFinance = () => {
  const dispatch = useDispatch()

  const {transactions,summary} = useSelector(selectAdminHomeData)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(()=>{
    const fetchTransactions = async () => {
      try {
        const {data} = await instance.get('/revenue/transactions',{withCredentials:true})
        if(data.success){
          dispatch(fetchTransactionsSuccess(data.transactions))
        }else{
          throw new Error(data.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed To Fetch Transactions")
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions()
  },[])

  const handleShowDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  }

  return (
    <Container fluid className="finance-container">
      <Row className="header mb-4">
        <Col>
          <h1>Financial Overview</h1>
        </Col>
      </Row>

      <Row className="stats-container g-4 mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Total Revenue</span>
                <FontAwesomeIcon icon={faIndianRupeeSign} className="stat-icon" />
              </div>
              <h2 className="stat-value">₹{summary.totalRevenue.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Total Transactions</span>
                <FontAwesomeIcon icon={faFileInvoice} className="stat-icon" />
              </div>
              <h2 className="stat-value">{summary.totalTransactions}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Avg. Transaction</span>
                <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
              </div>
              <h2 className="stat-value">₹{summary.averageTransaction.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Total Appointments</span>
                <FontAwesomeIcon icon={faCalendarCheck} className="stat-icon" />
              </div>
              <h2 className="stat-value">{summary.totalAppointments}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Total Orders</span>
                <FontAwesomeIcon icon={faBox} className="stat-icon" />
              </div>
              <h2 className="stat-value">{summary.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="recent-activity">
        <Card.Body>
          <h2 className="mb-4">Recent Transactions</h2>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>#{transaction.displayId}</td>
                      <td>
                        <span className={`status ${transaction.sourceType.toLowerCase()}`}>
                          {transaction.sourceType}
                        </span>
                      </td>
                      <td>₹{transaction.amount.toFixed(2)}</td>
                      <td>{convertISODate(transaction.date)}</td>
                      <td>
                        <Button size="sm" onClick={() => handleShowDetails(transaction)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center">No transactions available.</p>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <div>
              <p><strong>Transaction ID:</strong> {selectedTransaction.displayId}</p>
              <p><strong>Type:</strong> {selectedTransaction.sourceType}</p>
              <p><strong>Amount:</strong> ₹{selectedTransaction.amount.toFixed(2)}</p>
              <p><strong>Date:</strong> {convertISODate(selectedTransaction.date)}</p>
              <p><strong>Status:</strong> Completed</p>
            </div>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminFinance;
