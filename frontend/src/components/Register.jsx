import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const interestsArray = interests.split(',').map((interest) => interest.trim());
    try {
      const response = await axios.post('http://localhost:8000/users/signup', {
        username,
        password,
        interests: interestsArray,
      });

      console.log(response.data);

      if (response.status === 201) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Create Your Account</h2>
        <form className="mt-6" autoComplete="off" onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-600">
              User Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="interests" className="block text-sm text-gray-600">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              placeholder="e.g., coding, music, reading"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to={'/login'} className="text-sm text-gray-600 hover:underline">
            Already have an account? <span className="text-blue-600">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;