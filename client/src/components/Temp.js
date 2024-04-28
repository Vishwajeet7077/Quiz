import React, { useState } from 'react';

const Temp = () => {
    // Dummy data for students appearing for the exam
    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', status: 'Ongoing' },
        { id: 2, name: 'Jane Smith', status: 'Terminated' },
        { id: 3, name: 'Alice Johnson', status: 'Completed' },
        { id: 4, name: 'Bob Brown', status: 'Ongoing' },
        { id: 5, name: 'Eva Lee', status: 'Completed' },
        { id: 6, name: 'Michael Davis', status: 'Ongoing' },
        { id: 7, name: 'Sophia Wilson', status: 'Terminated' },
        
    ]);

    // Calculate the count of students with different statuses
    const getStatusCount = (status) => {
        return students.filter(student => student.status === status).length;
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Exam Dashboard</h1>
            <div className="grid grid-cols-3 gap-6">
                {/* Display count of students with different statuses */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold mb-2">Ongoing</h2>
                    <p className="text-3xl font-bold text-blue-500">{getStatusCount('Ongoing')}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold mb-2">Terminated</h2>
                    <p className="text-3xl font-bold text-red-500">{getStatusCount('Terminated')}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold mb-2">Completed</h2>
                    <p className="text-3xl font-bold text-green-500">{getStatusCount('Completed')}</p>
                </div>
            </div>
            {/* Display list of students with their statuses */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Students</h2>
                <ul className="divide-y divide-gray-200">
                    {students.map(student => (
                        <li key={student.id} className="py-4 flex justify-between items-center">
                            <span className="text-lg font-semibold">{student.name}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(student.status)}`}>
                                {student.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Function to determine badge color based on student status
const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'Ongoing':
            return 'bg-blue-100 text-blue-800';
        case 'Terminated':
            return 'bg-red-100 text-red-800';
        case 'Completed':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default Temp;
