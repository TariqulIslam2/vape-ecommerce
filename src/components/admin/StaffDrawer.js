import React, { useEffect } from "react";
import LabelArea from "./form/LabelArea";
import InputArea from "./form/InputArea";
import Error from "./form/Error";
import { useForm } from "react-hook-form";
import { Select } from "@windmill/react-ui";
const StaffDrawer = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (!isOpen) reset(); // Clear form when drawer closes
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const { name, email, password, phone, joiningDate, role } = data;
    const status = 1;
    //console.log(name, email, password, phone, joiningDate, role);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          contact: phone,
          joining_date: joiningDate,
          role,
          status,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Staff added successfully!");
        onSuccess();
        onClose();
        reset();
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("POST error:", err);
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Staff</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add your Staff and necessary information from here
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-grow  p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-md font-medium text-green-600 border-b border-green-600 pb-1 mb-6 inline-block">
                  Basic Info
                </h3>

                <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full ">
                  {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Staff Image" />
                  <div className="col-span-8 sm:col-span-4">
                    <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
                  </div>
                </div> */}

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Name" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={register}
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Staff name"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <Error errorName={errors.name} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Email" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={register}
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <Error errorName={errors.email} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Password" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={register}
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <Error errorName={errors.password} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Contact Number" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={register}
                        label="Contact Number"
                        name="phone"
                        type="text"
                        placeholder="Phone number"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <Error errorName={errors.phone} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <LabelArea label="Joining Date" />
                    <div className="col-span-8 sm:col-span-4">
                      <InputArea
                        register={register}
                        label="Joining Date"
                        name="joiningDate"
                        type="datetime-local"
                        placeholder="Joining date"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <Error errorName={errors.joiningDate} />
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 ">
                    <LabelArea label="Staff Role" />
                    <div className="col-span-8 sm:col-span-4">
                      <Select
                        {...register("role", { required: "Role is required" })}
                        label="Role"
                        name="role"
                        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800"
                      >
                        <option value="" >
                          Staff role
                        </option>
                        <option value="1">Admin</option>
                        <option value="2">Super Admin</option>

                      </Select>

                      <Error errorName={errors.role} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-between">
              <button onClick={onClose} className="btn btn-gray-800 w-50">
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white w-50">
                Add Staff
              </button>
            </div></form>
        </div>
      </div>
    </div>
  );
};

export default StaffDrawer;
