import React from 'react';
import { FaHome, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Dashboard</h2>
      <ul style={styles.menu}>
        <li style={styles.menuItem}>
          <FaHome style={styles.icon} />
          <Link to='/dashboard' style={styles.link}>Overview</Link> 
        </li>
        <li style={styles.menuItem}>
          <FaTable style={styles.icon} />
          <Link to='/table' style={styles.link}>PeopleDirectory</Link>
        </li>
      </ul> 
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#ffffff',  // White background
    color: '#2c3e50',
    padding: '15px',
    position: 'fixed',
    // boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',  // Optional: Adds a subtle shadow for separation
  },
  title: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    margin: '15px 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '10px',
    color: '#2c3e50',
  },
  link: {
    textDecoration: 'none',
    color: '#2c3e50',
    fontSize: '18px',
  },
};

export default Sidebar;
