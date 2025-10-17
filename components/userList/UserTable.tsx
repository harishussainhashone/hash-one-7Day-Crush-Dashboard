"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

type Customer = {
  id: number;
  email: string;
  name: string;
  created: string;
};

const customersData: Customer[] = [
  { id: 1, email: "testingforwebdemo@gmail.com", name: "cvsadmin", created: "14-Dec-2021" },
  { id: 2, email: "testingforwebdemo99@gmail.com", name: "alex george", created: "29-Apr-2022" },
  { id: 3, email: "selinawojcik2912@1secmail.org", name: "milagrowoodworth", created: "01-May-2022" },
  { id: 4, email: "lacyjefferson@chiefdan.com", name: "windyneidig5", created: "09-May-2022" },
  { id: 5, email: "breeze.rados@gmail.com", name: "Breeze Rados", created: "15-May-2022" },
  { id: 6, email: "lizngenni@yahoo.com", name: "Elizabeth Nieves", created: "04-Jun-2022" },
];

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); 
  const [exportScope, setExportScope] = useState<"page" | "filtered" | "all">("filtered");
  const itemsPerPage = 5;

  // ✅ Search filter
  const filteredCustomers = customersData.filter(
    (c) =>
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.created.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ✅ Decide which dataset to export
  const getExportData = () => {
    if (exportScope === "page") return paginatedCustomers;
    if (exportScope === "filtered") return filteredCustomers;
    return customersData;
  };

  // ✅ Export Functions
  const handleCopy = () => {
    const data = getExportData();
    const text = data.map((row) => `${row.email}\t${row.name}\t${row.created}`).join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleExcel = () => {
    const data = getExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "customers.xlsx");
  };

  const handleCSV = () => {
    const data = getExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.csv";
    link.click();
  };

  const handlePDF = () => {
    const data = getExportData();
    const doc = new jsPDF();

    doc.text("Customers List", 14, 10);

    autoTable(doc, {
      head: [["Email", "Name", "Created"]],
      body: data.map((row) => [row.email, row.name, row.created]),
    });

    doc.save("customers.pdf");
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-full">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-[-16px]">
        
        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} className="bg-gray-800 text-white px-3 py-1 rounded shadow hover:bg-gray-700 text-xs sm:text-sm">Copy</button>
          <button onClick={handleExcel} className="bg-gray-800 text-white px-3 py-1 rounded shadow hover:bg-gray-700 text-xs sm:text-sm">Excel</button>
          <button onClick={handleCSV} className="bg-gray-800 text-white px-3 py-1 rounded shadow hover:bg-gray-700 text-xs sm:text-sm">CSV</button>
          <button onClick={handlePDF} className="bg-gray-800 text-white px-3 py-1 rounded shadow hover:bg-gray-700 text-xs sm:text-sm">PDF</button>
        </div>

        {/* Search Box */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm text-gray-700 mb-1">Search:</label>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-48 
             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
          />
        </div>
      </div>

      {/* Table with Scroll */}
      <div className="overflow-x-auto sm:overflow-x-visible mt-4">
        <div className="max-h-64 overflow-y-auto custom-scroll">
          <table className="w-full border-collapse border text-xs sm:text-sm hidden sm:table">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left font-medium">S.No</th>
                <th className="border px-4 py-2 text-left font-medium">Email</th>
                <th className="border px-4 py-2 text-left font-medium">Name</th>
                <th className="border px-4 py-2 text-left font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((c, index) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{(page - 1) * itemsPerPage + index + 1}</td>
                    <td className="border px-4 py-2">{c.email}</td>
                    <td className="border px-4 py-2">{c.name}</td>
                    <td className="border px-4 py-2">{c.created}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500 text-sm">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden flex flex-col gap-4 max-h-64 overflow-y-auto custom-scroll">
          {paginatedCustomers.length > 0 ? (
            paginatedCustomers.map((c, index) => (
              <div key={c.id} className="border rounded-lg p-4 bg-gray-50 text-xs">
                <div className="flex justify-between mb-2"><span className="font-medium">S.No:</span><span>{(page - 1) * itemsPerPage + index + 1}</span></div>
                <div className="flex justify-between mb-2"><span className="font-medium">Email:</span><span>{c.email}</span></div>
                <div className="flex justify-between mb-2"><span className="font-medium">Name:</span><span>{c.name}</span></div>
                <div className="flex justify-between mb-2"><span className="font-medium">Created:</span><span>{c.created}</span></div>
                <div className="flex justify-between"><span className="font-medium">Action:</span><button className="text-blue-600 hover:underline text-xs">View</button></div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs">No data available</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs sm:text-sm text-gray-600 gap-2 sm:gap-0">
        <p>
          Showing {(page - 1) * itemsPerPage + 1} to {(page - 1) * itemsPerPage + paginatedCustomers.length} of {filteredCustomers.length} entries
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}>
            Previous
          </button>
          <button className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
