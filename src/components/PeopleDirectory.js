import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaTimes, FaPlus, FaEdit } from 'react-icons/fa';
import Table from './Table';
import DetailsCard from './DetailsCard';
import ActionIcons from './ActionIcons';

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
            onEdit={() => {
              console.log('Edit button clicked for:', info.row.original);
              setEditingRow(info.row.original);
            }}
            onDelete={() => {
              console.log('Delete button clicked for:', info.row.original._id);
              handleDelete(info.row.original._id);
            }}
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
    console.log('Fetching data from API...');
    axios.get('/api/members')
      .then(response => {
        console.log('Data fetched:', response.data);
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = (id) => {
    console.log('Delete function initiated for ID:', id);
    if (window.confirm('Are you sure you want to delete this member?')) {
      axios.delete(`/api/members/${id}`)
        .then(() => {
          console.log('Member deleted successfully');
          setData(prevData => prevData.filter(item => item._id !== id));
          setFilteredData(prevData => prevData.filter(item => item._id !== id));
          setRowSelection(null);
          setTableColumns(5);
          alert('Member deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting member:', error);
          alert('Failed to delete member.');
        });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected for upload:', file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'newEvona');
      formData.append('cloud_name', 'da7eitibw');
      try {
        console.log('Uploading file...');
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/da7eitibw/image/upload',
          formData
        );
        console.log('File uploaded, response:', response.data);
        if (response.data) {
          const url = response.data.secure_url;
          setProfilePhoto(url);
          console.log('Profile photo URL set:', url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      }
    }
  };

  const handleEditSubmit = async (values) => {
    console.log('Edit submit initiated with values:', values);
    const profilePhotoUrl = profilePhoto || editingRow.profilePhoto;
    const updatedValues = { ...values, profilePhoto: profilePhotoUrl };
    try {
      console.log('Updating member with ID:', editingRow._id);
      const response = await axios.put(`/api/members/${editingRow._id}`, updatedValues);
      console.log('Member updated successfully:', response.data);
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
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member.');
    }
  };

  const handleAddSubmit = async (values) => {
    console.log('Add submit initiated with values:', values);
    const profilePhotoUrl = profilePhoto || '';
    const newValues = { ...values, profilePhoto: profilePhotoUrl };
    try {
      console.log('Adding new member');
      const response = await axios.post('/api/members', newValues);
      console.log('New member added successfully:', response.data);
      const newMember = response.data;
      setData(prevData => [...prevData, newMember]);
      setFilteredData(prevData => [...prevData, newMember]);
      setIsAdding(false);
      reset();
      setProfilePhoto(''); // Clear the profile photo state
      alert('Member added successfully!');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member.');
    }
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
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
    console.log('Filter change with roles:', roles, 'and teams:', teams);
    setFilteredData(
      data.filter(item =>
        (roles.length === 0 || roles.includes(item.role)) &&
        (teams.length === 0 || teams.includes(item.teams))
      )
    );
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    setRowSelection(row);
    setTableColumns(2);
  };

  const handleCloseDetails = () => {
    console.log('Closing details card');
    setRowSelection(null);
    setTableColumns(5);
  };

  return (
    <div className="p-5 ml-[250px]">
      {/* Search and Add Bar */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => {
            console.log('Add button clicked');
            setIsAdding(true);
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Member
        </button>
      </div>

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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-1/3">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                console.log('Close modal clicked');
                setEditingRow(null);
                setIsAdding(false);
                reset();
              }}
            >
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit(editingRow ? handleEditSubmit : handleAddSubmit)}>
  <h2 className="text-xl font-bold mb-4">
    {editingRow ? 'Edit Member' : 'Add Member'}
  </h2>

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
    <input
      type="text"
      {...register('name')}
      defaultValue={editingRow ? editingRow.name : ''}
      placeholder="Name"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('status')}
      defaultValue={editingRow ? editingRow.status : ''}
      placeholder="Status"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('role')}
      defaultValue={editingRow ? editingRow.role : ''}
      placeholder="Role"
      className="p-2 border rounded-md"
    />
    <input
      type="email"
      {...register('email')}
      defaultValue={editingRow ? editingRow.email : ''}
      placeholder="Email Address"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('teams')}
      defaultValue={editingRow ? editingRow.teams : ''}
      placeholder="Teams"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('workEmail')}
      defaultValue={editingRow ? editingRow.workEmail : ''}
      placeholder="Work Email"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('gender')}
      defaultValue={editingRow ? editingRow.gender : ''}
      placeholder="Gender"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('nationality')}
      defaultValue={editingRow ? editingRow.nationality : ''}
      placeholder="Nationality"
      className="p-2 border rounded-md"
    />
    <input
      type="text"
      {...register('contactNo')}
      defaultValue={editingRow ? editingRow.contactNo : ''}
      placeholder="Contact Number"
      className="p-2 border rounded-md"
    />
  </div>

  <div className="flex justify-end mt-6">
    <button
      type="submit"
      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
    >
      {editingRow ? 'Save Changes' : 'Add Member'}
    </button>
    <button
      type="button"
      onClick={() => {
        setEditingRow(null);
        setIsAdding(false);
        reset();
      }}
      className="ml-4 text-gray-700"
    >
      Cancel
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
