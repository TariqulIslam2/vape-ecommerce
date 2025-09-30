"use client";
import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import ProductDrawer from "@/components/admin/ProductDrawer";
import PageTitle from "@/components/admin/Typography/PageTitle";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
// import Image from "next/image";
import Link from "next/link";
// import EditProductModal from '@/components/admin/EditProductModal';

export default function ProductsTable() {
  // Sample product data - expanded to demonstrate pagination
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");

        const data = await res.json();
        const filteredData = data.filter(item => item.status === 1);
        setCategory(filteredData);

      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        // console.log(data);
        setProducts(data);
        setRefresh(false)
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [refresh]);
  const [showDrawer, setShowDrawer] = useState(false);
  // console.log(products)

  const openDrawer = () => {
    setShowDrawer(true);
  };
  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 15;
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const filteredProducts = products.filter((product) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      (product.product_name?.toLowerCase() || '').includes(lowerSearch)


    const matchesCategory =
      searchCategory === '' || product.category_name?.toString() === searchCategory;

    return matchesSearch && matchesCategory;
  })
    .sort((a, b) => {
      if (priceOrder === 'lowToHigh') {
        return a.single_price - b.single_price;
      } else if (priceOrder === 'highToLow') {
        return b.single_price - a.single_price;
      }
      return 0;
    });

  // Get current page products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // State for selected rows
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(products.map((product) => product.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handlePublishToggle = async (id, published) => {
    const numericStatus = published ? 1 : 0;
    // console.log(id, published)
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, published: numericStatus, status: numericStatus }),
      });

      const data = await res.json();
      // console.log("Update response:", data);

      if (res.ok) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id
              ? { ...product, published: numericStatus, status: numericStatus }
              : product
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

  const handleTopToggle = async (id, top) => {
    const numericTop = top ? 1 : 0;
    // console.log(id, top)
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, top: numericTop }),
      });

      const data = await res.json();
      // console.log("Update response:", data);

      if (res.ok) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id
              ? { ...product, top: numericTop }
              : product
          )
        );
      } else {
        alert("Failed to update top: " + data.message);
      }
    } catch (error) {
      console.error("Top update error:", error);
      alert("Something went wrong.");
    }

  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
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
        <PageTitle>Products</PageTitle>

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
                  className="dark:stroke-gray-200"
                />
              </svg>
              <span>Export</span>
            </button>
          </div>

          <div className="flex space-x-2">
            

            <button
              onClick={() => openDrawer()}
              aria-label="Add Product"
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
                  className="dark:stroke-gray-200"
                />
              </svg>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            placeholder="Search Product"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-200" onChange={(e) => setSearchCategory(e.target.value)}>
            <option key={0} value="">Category</option>
            {
              category.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)
            }
          </select>

          <select className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-200" onChange={(e) => setPriceOrder(e.target.value)}>
            <option key={0} value="">Price</option>
            <option key={1} value="lowToHigh">Low to High</option>
            <option key={2} value="highToLow">High to Low</option>
          </select>

          <button onClick={() => {
            setSearchTerm("")
            setPriceOrder("")
            setSearchCategory("")
          }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
            Reset
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-800">
              <tr>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Price
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  View
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Top
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">

                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-start space-x-2 max-w-[300px]">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.product_name}
                          width={50}
                          loading="eager"
                          fetchpriority="high"
                          decoding="async"
                          height={50}
                          className="flex-shrink-0"
                        />
                      )}
                      <span className="break-words">{product.product_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.category_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {product.single_price?.toFixed(2)} AED
                  </td>
                  {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ${product.sale_price?.toFixed(2)}
                  </td> */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 1
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {product.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                      <Link href={`/dashboard/products/${product.id}`} aria-label="View Product">
                        <Eye size={18} />
                      </Link>
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <button
                        onClick={() => handlePublishToggle(product?.id, product.published === 0)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${product.published === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                      >
                        {product.published === 1 ? (
                          <FaToggleOn className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <FaToggleOff className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                        {product.published === 1 ? "Published" : "Draft"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <button
                        onClick={() => handleTopToggle(product?.id, product.top === 0)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${product.top === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                      >
                        {product.top === 1 ? (
                          <FaToggleOn className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <FaToggleOff className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                        {product.top === 1 ? "Yes" : "No"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/products/${product.id}/edit`} aria-label="Edit Product">
                        <button
                          className="text-blue-600 hover:text-blue-900" aria-label="Edit Product"
                        >
                          <Edit size={18} />
                        </button>

                      </Link>

                      <button onClick={() => handleDelete(product?.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" aria-label="Delete Product">
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
                        className="dark:fill-gray-200"
                      />
                    </svg>
                  </button>

                  {/* Generate page numbers dynamically */}
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`${currentPage === index + 1
                        ? "bg-green-500 text-white dark:bg-green-600"
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
                          ? "bg-green-500 text-white dark:bg-green-600"
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
                        className="dark:fill-gray-200"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} onSuccess={() => setRefresh(true)} />
     
    </div>
  );
}
