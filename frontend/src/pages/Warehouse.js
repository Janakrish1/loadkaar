import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

function WarehousePage() {
  const { userID } = useSelector((state) => state.user);
  const [warehouses, setWarehouses] = useState([]); // State to store the list of warehouses
  const [formData, setFormData] = useState({
    warehouse_name: "",
    address: "",
    location: "",
    available_sqft: "",
    availability_status: "available",
    amenities: "",
    price_per_hour: "",
  });
  const [editingId, setEditingId] = useState(null); // Track which warehouse is being edited

  // Fetch warehouses from the server
  const fetchWarehouses = async () => {
    try {
      const warehouseDetails = {user_id: userID};
      const response = await axios.get("http://localhost:5001/api/warehouses", warehouseDetails);
      if(response.data.message === "No Warehouses found for this user") 
        {
          setWarehouses([]);
        }
        else{
        if (Array.isArray(response.data)) {
            setWarehouses(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding/editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    const warehouseData = {...formData, user_id: userID};
    try {
      if (editingId) {
        // Update warehouse
        const response = await axios.put(`http://localhost:5001/api/warehouses/${editingId}`, warehouseData);
        console.log("Warehouse updated:", response.data);
      } else {
        // Validate mandatory fields
        if (
        !formData.warehouse_name.trim() ||
        formData.available_sqft <= 0 ||
        !formData.address.trim() ||
        !formData.amenities.trim() ||
        formData.price_per_hour <= 0
        ) {
            alert("Please fill out all fields with valid values.");
            return;
        }
        // Add warehouse
        const response = await axios.post("http://localhost:5001/api/warehouses", warehouseData);
        console.log("Warehouse added:", response.data);
      }

      setFormData({
        warehouse_name: "",
        address: "",
        location: "",
        available_sqft: "",
        availability_status: "available",
        amenities: "",
        price_per_hour: "",
      });
      setEditingId(null);
      fetchWarehouses();
    } catch (error) {
      console.error("Error saving warehouse:", error);
    }
  };

  // Handle delete
  const handleDelete = async (warehouse_id) => {
    const warehouseId = {warehouse_id: warehouse_id};
    try {
      await axios.delete("http://localhost:5001/api/warehouses", warehouseId);
      console.log("Warehouse deleted.");
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  // Handle edit
  const handleEdit = (warehouse) => {
    setFormData(warehouse);
    setEditingId(warehouse.warehouse_id);
  };

  useEffect(() => {
    fetchWarehouses(); // Fetch warehouses on component mount
  }, []);

  return (
    <div>
      {/* Form for Adding/Editing */}
      <form onSubmit={handleSubmit}>
        <label>Warehouse Name</label>
        <input
          type="text"
          name="warehouse_name"
          value={formData.warehouse_name}
          onChange={handleInputChange}
          required
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />

        <label>Available Sqft</label>
        <input
          type="number"
          name="available_sqft"
          value={formData.available_sqft}
          onChange={handleInputChange}
          required
        />

        <label>Availability Status</label>
        <select
          name="availability_status"
          value={formData.availability_status}
          onChange={handleInputChange}
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>

        <button type="submit">{editingId ? "Update" : "Add"} Warehouse</button>
      </form>

      {/* Warehouse Table */}
      <table>
        <thead>
          <tr>
            <th>Warehouse Name</th>
            <th>Available Sqft</th>
            <th>Availability Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.warehouse_id}>
              <td>{warehouse.warehouse_name}</td>
              <td>{warehouse.available_sqft}</td>
              <td>{warehouse.availability_status}</td>
              <td>
                <button onClick={() => handleEdit(warehouse)}>Edit</button>
                <button onClick={() => handleDelete(warehouse.warehouse_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WarehousePage;