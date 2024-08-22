import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActionIcons = ({ onEdit, onDelete }) => (
  <div style={styles.actionIcons}>
    <FaEdit onClick={onEdit} style={{ cursor: 'pointer', color: '#4CAF50' }} />
    <FaTrash onClick={onDelete} style={{ cursor: 'pointer', color: '#f44336' }} />
  </div>
);

const styles = {
  actionIcons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
};

export default ActionIcons;
