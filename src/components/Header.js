// Header.js
import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>MyLogo</div>
      <div style={styles.headerIcons}>
        <FaBell style={styles.icon} />
        <FaUserCircle style={styles.icon} />
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Changed background color to white
    color: '#34495e', // Updated default text color
    padding: '30px 60px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8e44ad', // Changed logo color to purple
  },
  headerIcons: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginLeft: '20px',
    fontSize: '24px',
    cursor: 'pointer',
  },
};

export default Header;
