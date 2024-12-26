import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Checklist = () => {
  const [checklists, setChecklists] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editedItemId, setEditedItemId] = useState(null);
  const [editedItemName, setEditedItemName] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await API.get(`/checklists/checklists/${user._id}`);
        setChecklists(response.data);
      } catch (err) {
        console.error("Error fetching checklists:", err);
      }
    };

    fetchChecklists();
  }, []);

  const handleAddChecklist = async () => {
    if (!newItemName.trim()) {
      alert("Please enter an item name.");
      return;
    }

    try {
      const newItem = { title: newItemName, completed: false };
      const response = await API.post(
        `/checklists/create-checklist/${user._id}`,
        newItem
      );
      setChecklists((prev) => [...prev, response.data]);
      setNewItemName("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding checklist item:", err);
    }
  };

  const handleToggleCompleted = async (itemId, currentStatus) => {
    try {
      const response = await API.put(`/checklists/checklist/${itemId}/check`);
      const updatedItem = response.data;

      setChecklists((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, completed: updatedItem.completed } : item
        )
      );
    } catch (err) {
      console.error("Error updating checklist item:", err);
    }
  };

  const handleEditChecklist = (itemId, currentTitle) => {
    setEditedItemId(itemId);
    setEditedItemName(currentTitle);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editedItemName.trim() !== "") {
      try {
        const response = await API.put(`/checklists/checklist/${editedItemId}/edit`, {
          title: editedItemName,
        });
        setChecklists((prev) =>
          prev.map((item) =>
            item._id === editedItemId ? { ...item, title: response.data.title } : item
          )
        );
        setShowEditModal(false);
        setEditedItemName(""); // Clear edited item name
      } catch (err) {
        console.error("Error editing checklist item:", err);
      }
    }
  };

  const handleDeleteChecklist = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await API.delete(`/checklists/checklist/${itemId}`);
        setChecklists((prev) => prev.filter((item) => item._id !== itemId));
      } catch (err) {
        console.error("Error deleting checklist item:", err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#121212] flex items-center justify-center py-12 px-6 mt-10">
        <div className="w-full max-w-3xl bg-[#1D1D1D] rounded-2xl shadow-lg p-6">
          <h2 className="text-5xl font-serif text-[#F4B8A5] text-center mb-10">
            📃 Your Checklist 📃
          </h2>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white text-lg font-semibold py-4 px-12 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              + Add Checklist Item
            </button>
          </div>
          <ul className="space-y-4">
            {checklists.length > 0 ? (
              checklists.map((checklist) => (
                <li
                  key={checklist._id}
                  className="flex items-center justify-between p-4 bg-[#2D2D2D] border border-[#333333] rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={checklist.completed}
                      onChange={() =>
                        handleToggleCompleted(checklist._id, checklist.completed)
                      }
                      className="h-5 w-5 text-[#4ECDC4] rounded-full border-2 border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]"
                    />
                    <span
                      className={`text-lg font-medium ${
                        checklist.completed ? "line-through text-[#A3A3A3]" : "text-[#D1D1D1]"
                      }`}
                    >
                      {checklist.title}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditChecklist(checklist._id, checklist.title)}
                      className="bg-gradient-to-r from-[#FFBB3B] to-[#FF8C00] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-[#E0A731] hover:to-[#CC7600] transform hover:scale-105 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChecklist(checklist._id)}
                      className="bg-gradient-to-r from-[#FF6B6B] to-[#FF4A4A] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-[#E05555] hover:to-[#CC3B3B] transform hover:scale-105 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-2xl text-[#D1D1D1] font-light">
                No items in your checklist yet.
              </p>
            )}
          </ul>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#2D2D2D] p-8 rounded-2xl shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-serif text-[#F4B8A5] mb-6 text-center">
                Add Checklist Item
              </h3>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter item name"
                className="w-full border border-[#333333] p-4 rounded-lg mb-6 bg-[#333333] text-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-[#444444] text-[#D1D1D1] py-3 px-6 rounded-lg shadow-md hover:bg-[#5A5A5A] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddChecklist}
                  className="bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#2D2D2D] p-8 rounded-2xl shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-serif text-[#F4B8A5] mb-6 text-center">
                Edit Checklist Item
              </h3>
              <input
                type="text"
                value={editedItemName}
                onChange={(e) => setEditedItemName(e.target.value)}
                placeholder="Edit item name"
                className="w-full border border-[#333333] p-4 rounded-lg mb-6 bg-[#333333] text-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-[#444444] text-[#D1D1D1] py-3 px-6 rounded-lg shadow-md hover:bg-[#5A5A5A] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-gradient-to-r from-[#4ECDC4] to-[#2A8E8B] text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checklist;
