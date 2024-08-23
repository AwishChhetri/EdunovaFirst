import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

// Define the validation schema using Zod
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

const FormModal = ({ editingRow, onClose, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editingRow?.name || '',
      status: editingRow?.status || '',
      role: editingRow?.role || '',
      email: editingRow?.email || '',
      teams: editingRow?.teams || '',
      workEmail: editingRow?.workEmail || '',
      dob: editingRow?.dob || '',
      gender: editingRow?.gender || '',
      nationality: editingRow?.nationality || '',
      contactNo: editingRow?.contactNo || '',
      profilePhoto: editingRow?.profilePhoto || '',
    },
  });

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
          // Update the profile photo URL in the form's default values
          reset({
            ...reset.defaultValues,
            profilePhoto: url,
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {editingRow ? 'Edit Member' : 'Add Member'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {reset.defaultValues.profilePhoto && (
              <img
                src={reset.defaultValues.profilePhoto}
                alt="Profile Preview"
                className="w-24 h-24 mt-4 rounded-full"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register('name')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              {...register('status')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              {...register('role')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register('email')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Teams
            </label>
            <input
              {...register('teams')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              {editingRow ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
