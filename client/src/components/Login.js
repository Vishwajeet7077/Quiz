
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id || !formData.password) {
      toast.error('Please fill in all details');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login Successful!');
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex w-full justify-center items-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 sticky top-0">
        <div className="w-full px-4 md:px-8 lg:px-10 max-w-md">
          <h2 className="text-white font-extrabold text-4xl mb-8">Quiz Application</h2>
          <form className="bg-white rounded-md shadow-lg p-6" onSubmit={handleSubmit}>
            <h1 className="text-blue-800 font-bold text-3xl mb-4">Login</h1>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 text-sm mb-1">
                PRN / Faculty ID / Admin ID
              </label>
              <input
                id="email"
                className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none transition-all focus:border-blue-500"
                type="text"
                name="id"
                placeholder="Enter ID"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 text-sm mb-1">
                Password
              </label>
              <input
                id="password"
                className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none transition-all focus:border-blue-500"
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="block w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 text-white font-semibold transition-all duration-300"
            >
              Login
            </button>
            <div className="flex justify-end mt-4">
              <p className="text-sm mr-2">Don't have an account yet?</p>
              <NavLink
                to="/signup"
                className="text-sm text-blue-500 hover:underline cursor-pointer transition-all duration-300"
              >
                Signup
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
