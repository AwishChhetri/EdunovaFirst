import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, getSortedRowModel, createColumnHelper } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaTimes } from 'react-icons/fa';
import Table from './Table';
import SearchBar from './SearchBar';
import DetailsCard from './DetailsCard';
import ActionIcons from './ActionIcons';
import { FaPlus, FaEdit } from 'react-icons/fa';

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
  profilePhoto: z.any().optional(),
});

const PeopleDirectory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rowSelection, setRowSelection] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tableColumns, setTableColumns] = useState(5);
  const [profilePhoto, setProfilePhoto] = useState('');

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const columnHelper = createColumnHelper();
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('profilePhoto', {
        header: 'Photo',
        cell: (info) => (
          <img src={info.getValue()} alt="Profile" className="w-12 h-12 rounded-full" />
        ),
      }),
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
            onDelete={() => handleDelete(info.row.original._id)}
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
          setData(prevData => prevData.filter(item => item._id !== id));
          setFilteredData(prevData => prevData.filter(item => item._id !== id));
          setRowSelection(null);
          setTableColumns(5);
          alert('Member deleted successfully!');
        })
        .catch(error => console.error('Error deleting member:', error));
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'newEvona');
      formData.append('cloud_name', 'da7eitibw');
      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/da7eitibw/image/upload',
          formData
        );

        if (response.data) {
          const url = response.data.secure_url;
          setProfilePhoto(url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      }
    }
  };

  const handleEditSubmit = async (values) => {
    const profilePhotoUrl = profilePhoto || editingRow.profilePhoto;
  
    const updatedValues = { ...values, profilePhoto: profilePhotoUrl };
  
    axios.put(`/api/members/${editingRow._id}`, updatedValues)
      .then(response => {
        setData(prevData =>
          prevData.map(item => (item._id === editingRow._id ? response.data : item))
        );
        setFilteredData(prevData =>
          prevData.map(item => (item._id === editingRow._id ? response.data : item))
        );
        setEditingRow(null);
        reset();
        setProfilePhoto(''); // Clear the profile photo state
        alert('Member updated successfully!');
      })
      .catch(error => console.error('Error updating member:', error));
  };
  
  const handleAddSubmit = async (values) => {
    const profilePhotoUrl = profilePhoto || '';
  
    const newValues = { ...values, profilePhoto: profilePhotoUrl };
  
    axios.post('/api/members', newValues)
      .then(response => {
        const newMember = response.data;
        setData(prevData => [...prevData, newMember]);
        setFilteredData(prevData => [...prevData, newMember]);
        setIsAdding(false);
        reset();
        setProfilePhoto(''); // Clear the profile photo state
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

  const handleFilterChange = ({ roles, teams }) => {
    setFilteredData(
      data.filter(item =>
        (roles.length === 0 || roles.includes(item.role)) &&
        (teams.length === 0 || teams.includes(item.teams))
      )
    );
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
    <div className="p-5 ml-[250px]">
      <SearchBar
        onSearch={handleSearch}
        onAddClick={() => setIsAdding(true)}
        onFilterChange={handleFilterChange}
      />

      <div className="flex">
        <Table table={table} onRowClick={handleRowClick} />

        {rowSelection && (
          <DetailsCard
            rowSelection={rowSelection}
            onClose={handleCloseDetails}
          />
        )}
      </div>

      {(editingRow || isAdding) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingRow ? 'Edit Member' : 'Add Member'}
              </h2>
              <button
                onClick={() => {
                  if (editingRow) setEditingRow(null);
                  if (isAdding) setIsAdding(false);
                  reset();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(
                editingRow ? handleEditSubmit : handleAddSubmit
              )}
            >
              {/* Profile Photo */}
              <div className="mb-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                  {profilePhoto || editingRow?.profilePhoto ? (
                    <img
                      src={profilePhoto || editingRow?.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Upload Photo Button with Edit Icon */}
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Upload Profile Photo
                </label>
                <label className="cursor-pointer flex items-center text-indigo-600 hover:text-indigo-800">
                  <FaEdit className="mr-2" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Edit Photo
                </label>
              </div>

              {/* Form Fields with Two Fields per Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    defaultValue={editingRow?.name || ''}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  />
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    {...register('status')}
                    defaultValue={editingRow?.status || ''}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  />
                </div>

                {/* Role */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    {...register('role')}
                    defaultValue={editingRow?.role || ''}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    defaultValue={editingRow?.email || ''}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md text-md hover:bg-indigo-700"
                >
                  {editingRow ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleDirectory;
