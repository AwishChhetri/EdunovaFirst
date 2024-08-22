import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, getSortedRowModel, createColumnHelper } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Table from './Table';
import SearchBar from './SearchBar';
import DetailsCard from './DetailsCard';
import FormModal from './FormModal';
import ActionIcons from './ActionIcons';

// Set Axios base URL
axios.defaults.baseURL = 'http://localhost:8080';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.string().min(1, 'Status is required'),
  role: z.string().min(1, 'Role is required'),
  email: z.string().email('Invalid email address'),
  teams: z.string().min(1, 'Team is required'),
  workEmail: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  contactNo: z.string().optional(),
});

const PeopleDirectory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tableColumns, setTableColumns] = useState(5);
 
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('status', { header: 'Status' }),
    ];

    if (tableColumns === 2) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      columnHelper.accessor('role', { header: 'Role' }),
      columnHelper.accessor('email', { header: 'Email Address' }),
      columnHelper.accessor('teams', { header: 'Teams' }),
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => (
          <ActionIcons
            row={info.row.original}
            onEdit={() => setEditingRow(info.row.original)}
            onDelete={() => handleDelete(info.row.original._id)}  // Use _id here
          />
        ),
      },
    ];
  }, [tableColumns]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    // Fetch initial data
    axios.get('/api/members')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      axios.delete(`/api/members/${id}`)
        .then(() => {
          setData(prevData => prevData.filter(item => item._id !== id));  // Use _id here
          setFilteredData(prevData => prevData.filter(item => item._id !== id));  // Use _id here
          setRowSelection(null);
          setTableColumns(5);
          alert('Member deleted successfully!');
        })
        .catch(error => console.error('Error deleting member:', error));
    }
  };

  const handleEditSubmit = (values) => {
    axios.put(`/api/members/${editingRow._id}`, values)
      .then(response => {
        setData(prevData => 
          prevData.map(item => (item._id === editingRow._id ? response.data : item))
        );
        setFilteredData(prevData =>
          prevData.map(item => (item._id === editingRow._id ? response.data : item))
        );
        setEditingRow(null);
        reset();  // Clear the form after edit
        alert('Member updated successfully!');
      })
      .catch(error => console.error('Error updating member:', error));
  };

  const handleAddSubmit = (values) => {
    console.log('Form values:', values); // Debugging log

    axios.post('/api/members', values)
      .then(response => {
        console.log('Response from server:', response.data); // Debugging log
        
        const newMember = response.data;
        setData(prevData => [...prevData, newMember]);
        setFilteredData(prevData => [...prevData, newMember]);
        setIsAdding(false);
        reset();  // Clear the form after adding
        alert('Member added successfully!');
      })
      .catch(error => {
        console.error('Error adding member:', error);
        alert('Failed to add member.');
      });
  };

  const handleSearch = (query) => {
    if (query) {
      setFilteredData(
        data.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.role.toLowerCase().includes(query.toLowerCase()) ||
          item.teams.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
    }
  };

  const handleRowClick = (row) => {
    setRowSelection(row);
    setTableColumns(2);
  };

  const handleCloseDetails = () => {
    setRowSelection(null);
    setTableColumns(5);
  };

  return (
    <div style={styles.content}>
      <SearchBar onSearch={handleSearch} />
      <button onClick={() => setIsAdding(true)} style={styles.addButton}>
        Add Member
      </button>

      <div style={styles.mainContent}>
        <Table table={table} onRowClick={handleRowClick} />

        {rowSelection && (
          <DetailsCard
            rowSelection={rowSelection}
            onClose={handleCloseDetails}
          />
        )}
      </div>

      {editingRow && (
        <FormModal
          title="Edit Member"
          defaultValues={editingRow}
          onSubmit={handleEditSubmit}
          onClose={() => {
            setEditingRow(null);
            reset();  // Clear the form when the modal is closed without saving
          }}
          register={register}
          handleSubmit={handleSubmit}
        />
      )}

      {isAdding && (
        <FormModal
          title="Add Member"
          onSubmit={handleAddSubmit}
          onClose={() => {
            setIsAdding(false);
            reset();  // Clear the form when the modal is closed without saving
          }}
          register={register}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const styles = {
  content: { padding: '20px', backgroundColor: '#f9f9f9', marginLeft: "250px" },
  addButton: {
    marginBottom: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
};

export default PeopleDirectory;
