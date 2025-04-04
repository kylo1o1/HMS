import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Dropdown, Modal, Form } from 'react-bootstrap';
import './AdminPatients.css';
import { useSelector } from 'react-redux';
import { selectAdminHomeData } from '../../Redux/selectors/adminSelector';
import { TbError404 } from "react-icons/tb";
const AdminPatients = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

 


  const {patients} = useSelector(selectAdminHomeData)

  

  const handleAction = async () => {
    if (!selectedPatient || !actionType) return;

    try {
      if (actionType === 'delete') {
        await axios.delete(`/api/admin/patient/${selectedPatient._id}/delete`);
      } else if (actionType === 'deactivate') {
        await axios.patch(`/api/admin/patient/${selectedPatient._id}/deactivate`);
      } else if (actionType === 'reactivate') {
        await axios.patch(`/api/admin/patient/${selectedPatient._id}/reactivate`);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Action failed');
    }
  };

  const handleShowModal = (patient, type) => {
    setSelectedPatient(patient);
    setActionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setActionType('');
  };

  const filteredPatients = patients.filter(patient => {
    return (
      (filterStatus === 'all' || (filterStatus === 'active' && patient.isActive) || (filterStatus === 'inactive' && !patient.isActive)) &&
      (patient.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="admin-patients-container mt-4">
      <h2 className="admin-patients-title">Patients List</h2>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          className="admin-patients-search"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Select
          value={filterStatus}
          className="admin-patients-filter"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </div>

      {filteredPatients.length > 0 ? (
        <Table striped  hover responsive className="shadow admin-patients-table">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              <tr key={patient._id}>
                <td>{index + 1}</td>
                <td>{patient.userId.name}</td>
                <td>{patient.userId.email}</td>
                <td>
                  <span className= {'admin-patients-status-active' }>
                    Active
                  </span>
                </td>
                <td>
                <Dropdown className="admin-patients-dropdown">
                    <Dropdown.Toggle
                    variant="info"
                    size="sm"
                    className="admin-patients-dropdown-toggle"
                    >
                    Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="admin-patients-dropdown-menu" align="end">
                    {patient.isActive ? (
                        <Dropdown.Item
                        className="admin-patients-dropdown-item"
                        onClick={() => handleShowModal(patient, 'deactivate')}
                        >
                        Deactivate
                        </Dropdown.Item>
                    ) : (
                        <Dropdown.Item
                        className="admin-patients-dropdown-item"
                        onClick={() => handleShowModal(patient, 'reactivate')}
                        >
                        Reactivate
                        </Dropdown.Item>
                    )}
                    <Dropdown.Item
                        className="admin-patients-dropdown-item text-danger"
                        onClick={() => handleShowModal(patient, 'delete')}
                    >
                        Delete Permanently
                    </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="admin-patients-no-data justify-content-center d-flex flex-column align-items-center">
          <TbError404 size={100}/>
          <p>No patients found.</p>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {actionType} this patient?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="danger" onClick={handleAction}>
            {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPatients;
