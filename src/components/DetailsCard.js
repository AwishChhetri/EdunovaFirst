import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

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
    <div className="bg-white shadow-lg rounded-lg p-6 relative max-w-md">
      {/* Close Button */}
      <button style={styles.closeButton} onClick={onClose}>
        <FaTimes />
      </button>
      
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src={details.profilePhoto || 'https://via.placeholder.com/150'} // Fallback to placeholder if no profile photo
          alt="Profile"
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{details.name}</h2>
          <p className="text-gray-500">@{details.username}</p>
          <p className="text-gray-500">{details.role}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-600">Date of Birth</span>
            <span className="text-gray-800">{details.dob ? new Date(details.dob).toLocaleDateString() : 'N/A'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Gender</span>
            <span className="text-gray-800">{details.gender || 'N/A'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Nationality</span>
            <span className="text-gray-800">{details.nationality || 'N/A'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Contact No.</span>
            <span className="text-gray-800">{details.contactNo || 'N/A'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="text-gray-800">{details.email}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Work Email</span>
            <span className="text-gray-800">{details.workEmail || 'N/A'}</span>
          </li>
        </ul>
      </div>

      {/* Research & Publication */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-md font-semibold text-gray-400 mb-2">Research & Publication</h3>
        <p className="text-gray-300 mb-4">{details.researchPublication}</p>
        <a href={details.publicationLink} className="text-orange-500 font-bold hover:underline">
          SEE PUBLICATION...
        </a>
      </div>

      {/* Cancel Button */}
      <button className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};

const styles = {
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#555',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
};

export default DetailsCard;
