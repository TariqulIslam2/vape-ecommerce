import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CategoryDrawer = ({ isOpen, onClose, onSuccess }) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when drawer is opened or closed
  useEffect(() => {
    if (!isOpen) reset(); // Clear on close
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const { name, description } = data;
    const status = 1; // default

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, status }),
      });

      const resData = await res.json();
      if (res.ok) {
        alert("Category added successfully!");
        onSuccess();     // Refresh category list
        onClose();       // Close drawer
        reset();         // Clear form
      } else {
        alert("Failed to add category: " + resData.message);
      }
    } catch (error) {
      console.error("POST Error:", error);
      alert("Something went wrong");
    }
  };


  return (
    <div className="relative">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900 dark:bg-black opacity-75 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`drawer drawer-end fixed inset-y-0 right-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-screen max-h-screen">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Category</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add your Category and necessary information from here
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-auto p-6 min-h-0">
            <div className="mb-6">
              <h3 className="text-md font-medium text-green-600 border-b border-green-600 pb-1 mb-6 inline-block">
                Basic Info
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Category Title/Name
                  </label>
                  <input
                    type="text"
                    placeholder="Category Title/Name"
                    {...register("name", { required: "Name is required" })}
                    className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Category Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="textarea textarea-bordered w-full h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    placeholder="Category Description"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-between">
              <button type="button" onClick={onClose} className="btn btn-gray-800 w-50">
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white w-50">
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryDrawer;
