import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

const DetailsCard = ({ rowSelection, onClose }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (rowSelection) {
      // Fetch the full details from the backend using the user ID
      axios.get(`/api/members/${rowSelection._id}`)
        .then(response => {
          setDetails(response.data);
        })
        .catch(error => console.error('Error fetching user details:', error));
    }
  }, [rowSelection]);

  if (!details) {
    return <div style={styles.loading}>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div style={styles.card}>
      <button style={styles.closeButton} onClick={onClose}>
        <FaTimes />
      </button>
      <h2 style={styles.cardTitle}>Details</h2>
      <p><strong>Name:</strong> {details.name}</p>
      <p><strong>Status:</strong> {details.status}</p>
      <p><strong>Role:</strong> {details.role}</p>
      <p><strong>Email:</strong> {details.email}</p>
      <p><strong>Work Email:</strong> {details.workEmail || 'N/A'}</p> {/* Display 'N/A' if workEmail is not available */}
      <p><strong>Teams:</strong> {details.teams}</p>
      <p><strong>Date of Birth:</strong> {details.dob ? new Date(details.dob).toLocaleDateString() : 'N/A'}</p> {/* Format date */}
      <p><strong>Gender:</strong> {details.gender || 'N/A'}</p> {/* Display 'N/A' if gender is not available */}
      <p><strong>Nationality:</strong> {details.nationality || 'N/A'}</p> {/* Display 'N/A' if nationality is not available */}
      <p><strong>Contact No:</strong> {details.contactNo || 'N/A'}</p> {/* Display 'N/A' if contactNo is not available */}
      <button style={styles.cancelButton} onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};

const styles = {
  card: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    position: 'relative', // Added for the close button positioning
  },
  cardTitle: { marginBottom: '10px' },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#555',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px', // Added margin-top for spacing
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
};

export default DetailsCard;
