import React from 'react';
import { FaTimes } from 'react-icons/fa';

const FormModal = ({ title, defaultValues = {}, onSubmit, onClose, register, handleSubmit }) => (
  <div style={styles.formOverlay}>
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <button style={styles.closeButton} onClick={onClose}>
        <FaTimes />
      </button>
      <h2>{title}</h2>
      <input
        {...register('name')}
        defaultValue={defaultValues.name}
        placeholder="Name"
        style={styles.input}
      />
      <input
        {...register('status')}
        defaultValue={defaultValues.status}
        placeholder="Status"
        style={styles.input}
      />
      <input
        {...register('role')}
        defaultValue={defaultValues.role}
        placeholder="Role"
        style={styles.input}
      />
      <input
        {...register('email')}
        defaultValue={defaultValues.email}
        placeholder="Email Address"
        style={styles.input}
      />
      <input
        {...register('teams')}
        defaultValue={defaultValues.teams}
        placeholder="Teams"
        style={styles.input}
      />
      <button type="submit" style={styles.saveButton}>
        Save
      </button>
      <button type="button" onClick={onClose} style={styles.cancelButton}>
        Cancel
      </button>
    </form>
  </div>
);

const styles = {
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
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
};

export default FormModal;