import React from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.body}>
        <Sidebar />
        <div style={styles.content}>
          <h1 style={styles.title}>Welcome! Abish</h1>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  body: {
    display: 'flex',
    flex: 1,
  },
  content: {
    padding: '20px',
    width: 'calc(100% - 250px)',
    marginLeft: '260px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
  },
};

export default Dashboard;
