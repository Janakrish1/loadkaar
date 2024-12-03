import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  // Function to fetch details for price and location
  const fetchAdditionalDetails = async (warehouseIds) => {
    try {
      // Fetch price details for all warehouses
      const priceResponse = await axios.post("http://localhost:5001/api/warehouse/prices", {
        warehouse_ids: warehouseIds,
      });

      // Fetch address and location details for all warehouses
      const locationResponse = await axios.post("http://localhost:5001/api/warehouse/location", {
        warehouse_ids: warehouseIds,
      });

      return {
        prices: priceResponse.data,
        locations: locationResponse.data,
      };
    } catch (error) {
      console.error("Error fetching additional details:", error);
      throw error;
    }
  };


  // Fetch warehouses from the server
  const fetchWarehouses = async () => {
    try {
      const warehouseDetails = { user_id: userID };
      const response = await axios.get("http://localhost:5001/api/fetchWarehouses", warehouseDetails);
      if (response.data.message === "No Warehouses found for this user") {
        setWarehouses([]);
      } else {
        if (Array.isArray(response.data)) {
          const warehouseIds = response.data.map((warehouse) => warehouse.warehouse_id);
          try {
            const { prices, locations } = await fetchAdditionalDetails(warehouseIds);
            const combinedData = response.data.map((warehouse) => {
              const priceDetails = prices.find(
                (price) => price.warehouse_id === warehouse.warehouse_id
              );
              const locationDetails = locations.find(
                (location) => location.warehouse_id === warehouse.warehouse_id
              );
  
              return {
                ...warehouse,
                price_per_hour: priceDetails?.price_per_hour || "N/A",
                address: locationDetails?.address || "N/A",
                location: locationDetails?.location || "N/A",
              };
            });
  
            setWarehouses(combinedData);
            console.log(combinedData);
          }
          catch (error) {
            console.error("Failed to fetch additional details.");
          }
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
      const warehouseData = { warehouse_name: formData.warehouse_name,
      available_sqft: formData.available_sqft, availability_status: formData.availability_status, amenities: formData.amenities
    };
    const warehousePricingData = { price_per_hour: formData.price_per_hour }; 
    const warehouseLocationData = { address: formData.address, location: formData.location };
    try {
      if (editingId) {
        // Update warehouse
        await axios.put("http://localhost:5001/api/updateWarehouse/", {...warehouseData, warehouse_id: editingId});
        await axios.put("http://localhost:5001/api/updateWarehousePricing/", {...warehousePricingData, warehouse_id: editingId});
        await axios.put("http://localhost:5001/api/updateWarehouseLocation/", {...warehouseLocationData, warehouse_id: editingId});
        console.log("Warehouse updated.");
      } else {
        // Add warehouse
        const warehouseResponse = await axios.post("http://localhost:5001/api/addWarehouse", {...warehouseData, user_id: userID});
        const warehouseId = warehouseResponse.data.warehouse_id;
        await axios.put("http://localhost:5001/api/updateWarehousePricing/", {...warehousePricingData, warehouse_id: warehouseId});
        await axios.put("http://localhost:5001/api/updateWarehouseLocation/", {...warehouseLocationData, warehouse_id: warehouseId});
        console.log("Warehouse added.");
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
      setIsModalOpen(false);
      fetchWarehouses();
    } catch (error) {
      console.error("Error saving warehouse:", error);
    }
  };

  // Handle delete
  const handleDelete = async (warehouse_id) => {
    const warehouseId = { warehouse_id: warehouse_id };
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
    setIsModalOpen(true);
  };

  // Handle add
  const handleAdd = () => {
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
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchWarehouses(); // Fetch warehouses on component mount
  }, []);

  return (
    <div>
      <button onClick={handleAdd}>Add Warehouse</button>

      {/* Modal for Adding/Editing */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? "Edit Warehouse" : "Add Warehouse"}</h3>
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

              <label>Amenities</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                required
              />

              <label>Price per Hour</label>
              <input
                type="number"
                name="price_per_hour"
                value={formData.price_per_hour}
                onChange={handleInputChange}
                required
              />

              <button type="submit">Save</button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)} // Close modal
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

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
                <button onClick={() => handleDelete(warehouse.warehouse_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WarehousePage;
