"use client";
import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import ProductDrawer from "@/components/admin/ProductDrawer";
import PageTitle from "@/components/admin/Typography/PageTitle";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import StaffDrawer from "@/components/admin/StaffDrawer";

const OurStaffpage = () => {
  // Sample product data - expanded to demonstrate pagination
  const [staffs, setStaffs] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add refresh state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRole, setSearchRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (staff) => {
    setFormData(staff); // preload data for editing
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchstaffs = async () => {
      try {
        const res = await fetch("/api/staff");
        const data = await res.json();
        setStaffs(data);
        setRefresh(false)
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchstaffs();
  }, [refresh]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSave = async () => {
    // console.log('Saving:', formData)

    try {
      const response = await fetch(`/api/staff`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      const updatedData = await response.json();
      // console.log('Updated:', updatedData);

      // Optionally show success message or refresh UI here
      setRefresh(true)
      closeModal();
      alert("update successfully!");
    } catch (error) {
      console.error('Error updating data:', error);
      // Optionally show error message to user
    }

  }

  const openDrawer = () => {
    setShowDrawer(true);
  };
  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalItems = staffs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredStaffs = staffs.filter((staff) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      (staff.name?.toLowerCase() || '').includes(lowerSearch) ||
      (staff.email?.toLowerCase() || '').includes(lowerSearch) ||
      (staff.contact?.toLowerCase() || '').includes(lowerSearch);

    const matchesRole =
      searchRole === '' || staff.role?.toString() === searchRole;

    return matchesSearch && matchesRole;
  });

  // Get current page staffs
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaffs = filteredStaffs.slice(indexOfFirstItem, indexOfLastItem);
  const handlePublishToggle = async (id, currentStatus) => {

    try {
      const res = await fetch("/api/staff", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: currentStatus ? 0 : 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        setStaffs((prev) =>
          prev.map((category) =>
            category.id === id ? { ...category, status: currentStatus ? 0 : 1 } : category
          )
        );
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this staff?")) return;

    try {
      const res = await fetch(`/api/staff?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Deleted successfully!");
        setRefresh(true)
        // optionally refresh or re-fetch categories
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred.");
    }
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageTitle>Our Staff</PageTitle>

        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name/email/phone"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-100"
          />

          <select
            onChange={(e) => setSearchRole(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-100"
            value={searchRole}
          >
            <option value="">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">Super Admin</option>
            <option value="3">User</option>
          </select>

          <button
            onClick={() => openDrawer()}
            aria-label="Add Staff"
            className="btn bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2 px-6 py-2 rounded dark:bg-green-600 dark:hover:bg-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Staff</span>
          </button>
          {/* <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded">
            Filter
          </button> */}

          <button onClick={() => {
            setSearchTerm("")
            setSearchRole("")
          }} aria-label="Reset" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
            Reset
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  STATUS
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentStaffs.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {staff.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {staff.email}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {staff.contact}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {isMounted ? new Date(staff.joining_date).toLocaleDateString('en-GB') : staff.joining_date?.split('T')[0] || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {staff.role === 1 ? "Admin" : staff.role === 2 ? "Super Admin" : "User"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.status === 1
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                    >
                      {staff.status === 1 ? "Active" : "Deactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <button
                        onClick={() => handlePublishToggle(staff?.id, staff.status)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${staff.status
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {staff.status ? (
                          <FaToggleOn className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <FaToggleOff className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                        {staff.status ? "Published" : "Draft"}
                      </button>{" "}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex space-x-2">
                      <button onClick={() => {
                        openModal();
                        setFormData({
                          id: staff?.id,
                          name: staff?.name,
                          email: staff?.email,
                          phone: staff?.contact,
                          role: staff?.role,

                        });
                      }} aria-label="Edit Staff" className="text-gray-500 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(staff?.id)} aria-label="Delete Staff" className="text-gray-500 hover:text-red-900 dark:text-gray-300 dark:hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Previous Page"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Previous Page"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Generate page numbers dynamically */}
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`${currentPage === index + 1
                        ? "bg-green-500 text-white dark:bg-green-700 dark:text-white"
                        : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium`}
                        aria-label="Page Number"
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Show the last page if there are more than 5 pages */}
                  {totalPages > 5 && (
                    <>
                      {totalPages > 6 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`${currentPage === totalPages
                          ? "bg-green-500 text-white dark:bg-green-700 dark:text-white"
                          : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium`}
                          aria-label="Last Page"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Next Page"
                        >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm"
            onClick={closeModal}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Update Staff</h3>
                <button
                  onClick={closeModal}
                  aria-label="Close Modal"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Enter phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select role</option>
                      <option value="1">Admin</option>
                      <option value="2">Super Admin</option>

                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 cursor border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white bg-green-500 dark:bg-green-600 cursor rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                  aria-label="Save Changes"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <StaffDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} onSuccess={() => setRefresh(!refresh)} />
    </div>
  );
};

export default OurStaffpage;
