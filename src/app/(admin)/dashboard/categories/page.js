"use client";
import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import ProductDrawer from "@/components/admin/ProductDrawer";
import PageTitle from "@/components/admin/Typography/PageTitle";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import CategoryDrawer from "@/components/admin/CategoryDrawer";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
const Categoriespage = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false); // Add refresh state
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  })

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    // console.log('Saving:', formData)


    try {
      const response = await fetch(`/api/category`, {
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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategoriesData(data);
        setRefresh(false)
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [refresh]);
  // console.log(categoriesData);


  const openDrawer = () => {
    setShowDrawer(true);
  };
  // Pagination setup

  const itemsPerPage = 15;
  const totalItems = categoriesData?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const filteredCategories = categoriesData.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Get current page categories
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);


  const handlePublishToggle = async (id, currentStatus) => {

    try {
      const res = await fetch("/api/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: currentStatus ? 0 : 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        setCategoriesData((prev) =>
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
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/category?id=${id}`, {
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
        <PageTitle className="dark:text-white">Category</PageTitle>

        <div className="flex justify-between mb-6">
          <div className="flex space-x-2">
            <button aria-label="Export" className="btn btn-outline border border-gray-300 dark:border-gray-700 flex items-center space-x-2 px-4 py-2 rounded bg-white dark:bg-gray-800 dark:text-gray-200">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Export</span>
            </button>
          </div>

          <div className="flex space-x-2">


            {/* <button className="btn bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2 px-6 py-2 rounded">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                />
              </svg>
              <span>Delete</span>
            </button> */}

            <button
              onClick={() => openDrawer()}
              aria-label="Add Category"
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
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Category Name"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-200"
          />

          {/* <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded">
            Filter
          </button> */}

          <button onClick={() => setSearchTerm("")} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded dark:bg-green-800 dark:hover:bg-green-900">
            Reset
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-800">
              <tr>
                {/* <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={toggleSelectAll}
                    checked={
                      selectedItems.length === categoriesData.length &&
                      categoriesData.length > 0
                    }
                  />
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
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
              {currentCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedItems.includes(category?.id)}
                      onChange={() => toggleSelectItem(category?.id)}
                    />
                  </td> */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {category?.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <span className="text-xl mr-2">{product.image}</span> */}
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {category?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[250px] break-words text-sm text-gray-500 dark:text-gray-300">
                    {category?.description}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <button
                        onClick={() => handlePublishToggle(category?.id, category.status)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${category.status
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {category.status ? (
                          <FaToggleOn className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <FaToggleOff className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                        {category.status ? "Published" : "Draft"}
                      </button>{" "}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          openModal();
                          setFormData({
                            id: category?.id,
                            name: category?.name,
                            description: category?.description,
                          });
                        }}
                        aria-label="Edit Category"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(category?.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" aria-label="Delete Category">
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
                        ? "bg-green-500 text-white dark:bg-green-600 dark:text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                          ? "bg-green-500 text-white dark:bg-green-600 dark:text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" onClick={closeModal}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4 relative" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update Category</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                aria-label="Close Modal"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:bg-gray-800 dark:text-gray-200"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none dark:bg-gray-800 dark:text-gray-200"
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-b-lg">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 cursor border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
      <CategoryDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSuccess={() => setRefresh(!refresh)}
      />
      {/* modal update  */}

    </div>
  );
};

export default Categoriespage;
