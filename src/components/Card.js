// Card.js
import React from 'react';

const Card = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div style={styles.card}>
      <button style={styles.closeButton} onClick={onClose}>X</button>
      <h2>Details</h2>
      <p><strong>Column 1:</strong> {data.col1}</p>
      <p><strong>Column 2:</strong> {data.col2}</p>
      <p><strong>Column 3:</strong> {data.col3}</p>
      <p><strong>Column 4:</strong> {data.col4}</p>
      <p><strong>Column 5:</strong> {data.col5}</p>
      <p><strong>Column 6:</strong> {data.col6}</p>
    </div>
  );
};

const styles = {
  card: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    marginLeft: '20px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default Card;
