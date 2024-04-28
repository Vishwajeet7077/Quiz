
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function FacultyTests() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFacultyTests();
  }, []);

  const fetchFacultyTests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/faculty/tests?created_by_id=${decodedToken.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch faculty tests');
      }
      const data = await response.json();
      setTests(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch faculty tests');
      setIsLoading(false);
    }
  };

  const handleOpenTest = (testId) => {
    navigate(`/mytests/${testId}`);
  };

  return (
    <div className="flex">
      <Sidebar decodedtoken={decodedToken} />
      <div className="flex flex-col justify-center items-center mt-8 w-full">
        <div className="max-w-lg w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Tests</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : tests.length > 0 ? (
            <div className="grid gap-4">
              {tests.map((test) => (
                <div key={test.test_id} className="bg-gray-100 rounded p-4 shadow-md">
                  <p className="text-lg font-semibold text-blue-700 mb-2">Test ID: {test.test_id}</p>
                  <div className="flex flex-col mb-4">
                    <span className="text-gray-700 font-semibold">Subject:</span>
                    <div className="text-gray-800">{test.course_name}</div>
                  </div>
                  <div className="flex flex-col mb-4">
                    <span className="text-gray-700 font-semibold">Duration:</span>
                    <div className="text-gray-800">{test.duration} minutes</div>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleOpenTest(test.test_id)}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tests created by you</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyTests;


