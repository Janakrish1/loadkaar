import React, { useState } from "react";
import "../styles/Profile_Settings.css"; // Import the CSS for styling
import logo from "../assets/logo.jpeg"; // Logo image for the header
import profileIcon from "../assets/Icons/profile.jpg"; // Placeholder for profile picture
import "../styles/Popup.css";
import Popup from './Popup';

function ProfileSettings() {
  // State for profile fields
  const [showPopup, setShowPopup] = useState(false);
  const [profile, setProfile] = useState({
    uniqueID: "1234567890", // Dummy unique ID from backend
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    password: "oldpassword", // Assuming this is the current password for validation
    address: "123 Main Street, Springfield, USA", // Dummy address
    profilePicture: profileIcon, // Default profile picture
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    password: false,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [changesMade, setChangesMade] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    if (!changesMade.includes(name)) {
      setChangesMade([...changesMade, name]);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmNewPassword") setConfirmNewPassword(value);
    if (name === "currentPassword") setCurrentPassword(value);
  };

  // Handle form submission (mock save action)
  const handleSave = (e) => {
    e.preventDefault();
    const changesText = changesMade.map((field) => `${field}: ${profile[field]}`).join(", ");
    setShowPopup(true);


    // const confirmSave = window.confirm(
    //   `The following fields have changed: ${changesText}. Do you want to save these changes?`
    // );
    // if (confirmSave) {
    //   alert("Profile updated successfully!");
    //   setChangesMade([]); // Reset changes after saving
    // } else {
    //   alert("Changes were not saved.");
    // }
  };

  const handleClose = () => {
    showPopup(false);
  }

  // Handle password change
  const handlePasswordChangeSubmit = () => {
    if (currentPassword === profile.password) {
      if (newPassword === confirmNewPassword) {
        setProfile({ ...profile, password: newPassword });
        alert("Password updated successfully!");
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Incorrect current password.");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Account deleted!");
    }
  };

  return (
    <div className="profile-settings-page">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="LoadKaar Logo" className="logo" />
        </div>
        <h1 className="website-name">LoadKaar</h1>
        <div className="profile-container">
          <div className="status active">ACTIVE</div>
          <div className="profile">
            <img src={profileIcon} alt="profile_pic" className="profile-icon" />
            <span>Profile</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-settings-container">
        <h1 className="page-title">Profile Settings</h1>
        <form className="profile-form" onSubmit={handleSave}>
          {/* Profile Picture */}
          <div className="profile-picture-section">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="profile-picture"
            />
            <label className="upload-label">
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                className="upload-input"
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Unique ID (Read-only) */}
          <div className="form-group">
            <label htmlFor="uniqueID">Unique ID</label>
            <input
              type="text"
              id="uniqueID"
              name="uniqueID"
              value={profile.uniqueID}
              readOnly
              className="read-only-input"
            />
          </div>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          {isEditing.password ? (
            <div className="password-change-section">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <button type="button" onClick={handlePasswordChangeSubmit}>
                Change Password
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing({ ...isEditing, password: true })}>
              Change Password
            </button>
          )}

          {/* Save Button */}
          <button onClick={handleSave} type="submit" className="save-button">
            Save Changes
          </button>

          {/* Delete Account Button */}
          <button type="button" className="delete-button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </form>
        {showPopup && <Popup />}
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 LoadKaar. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ProfileSettings;
