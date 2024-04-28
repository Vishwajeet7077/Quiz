
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState('student'); // Default to student
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    password: '',
    role: '',
    department: '',
  });

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.id || !formData.password || formData.role || !formData.department) {
      toast.error('Please fill all the required fields');
      return;
    }

    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(formData.fullName)) {
      toast.error('Please enter a valid name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.fullName,
          password: formData.password,
          department: formData.department,
          role: userType,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log('User registered successfully');
        toast.success('Registration successful');
        navigate('/');
      } else {
        console.error('Failed to register user');
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="flex w-full justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-gray-800 font-bold text-2xl mb-4">Create an Account</h1>
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-2">Select User Type</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-2">Full Name</label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-2">
                {userType === 'student' ? 'PRN' : userType === 'faculty' ? 'Faculty ID' : 'Admin ID'}
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                type="text"
                name="id"
                placeholder={`Enter ${userType === 'student' ? 'PRN' : userType === 'faculty' ? 'Faculty ID' : 'Admin ID'}`}
                value={formData.id}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-2">Password</label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-bold mb-2">Select Department</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="IT">IT</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg text-white font-semibold">
              Register
            </button>
            <p className="text-gray-600 text-sm mt-2">
              Already have an account?{' '}
              <NavLink to="/" className="text-blue-600 hover:underline">
                Login
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

