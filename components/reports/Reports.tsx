import React from 'react';

const Reports = () => {
  // Static report data
  const reports = [
    { id: 1, title: 'Q1 Sales Report', date: '2025-03-31', status: 'Completed', author: 'John Doe' },
    { id: 2, title: 'Q2 Sales Report', date: '2025-06-30', status: 'In Progress', author: 'Jane Smith' },
    { id: 3, title: 'Annual Performance', date: '2025-12-31', status: 'Pending', author: 'Alex Brown' },
  ];

  return (
    <div className="min-h-screen pt-6">
      <div className="max-w-full">
        {/* Header */}
        <header className="mb-6">
          <h1 className=" text-3xl font-medium text-gray-700 mb-6">Reports</h1>
          <p className="text-gray-600 mt-2">View and manage your business reports</p>
        </header>

        {/* Reports Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;