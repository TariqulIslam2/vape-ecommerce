"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required pieces
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import Chart from "@/components/admin/chart/ChartCard";
import CardItem from "@/components/admin/dashboard/CardItem";
import CardItemTwo from "@/components/admin/dashboard/CardItemTwo";
import PageTitle from "@/components/admin/Typography/PageTitle";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaCreditCard,
  FaSyncAlt,
  FaTruckMoving,
  FaCheckCircle,
  FaHourglassHalf,
  FaShippingFast,
} from "react-icons/fa";
import Loading from "@/components/admin/preloader/Loading";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  TableRow,
  TableBody,
  Windmill,
  Select,
} from "@windmill/react-ui";
import Status from "@/components/admin/table/Status";
import { EyeIcon, PrinterIcon, View } from "lucide-react";
import Link from "next/link";

const Dashboardpage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    todayOrders: { count: 0, total: 0 },
    yesterdayOrders: { count: 0, total: 0 },
    thisMonthOrders: { count: 0, total: 0 },
    totalOrders: { count: 0, total: 0 },
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Utility function to get dates
  const getDateRanges = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    return {
      today: today.toISOString().split('T')[0],
      yesterday: yesterday.toISOString().split('T')[0],
      startOfMonth: startOfMonth.toISOString().split('T')[0],
      startOfYear: startOfYear.toISOString().split('T')[0],
    };
  };

  // Fetch orders and order items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersResponse = await fetch("/api/orders");
        const ordersData = await ordersResponse.json();
        // console.log(ordersData);
        // Fetch order items
        const orderItemsResponse = await fetch("/api/order-items");
        const orderItemsData = await orderItemsResponse.json();
        // console.log("orderItemsData", orderItemsData);
        setOrders(ordersData);
        setOrderItems(orderItemsData);
        const productRevenueMap = {};

        orderItemsData.forEach(item => {
          const productId = item.product_id;
          const revenue = parseFloat(item.price) * parseInt(item.quantity);

          if (!productRevenueMap[productId]) {
            productRevenueMap[productId] = {
              productId: productId,
              productName: item.product_name,
              revenue: 0,
              quantity: 0,
            };
          }
          productRevenueMap[productId].revenue += revenue;
          productRevenueMap[productId].quantity += parseInt(item.quantity);
        });

        // Convert the map to an array of rows, sort by revenue, and take top 5
        const totalRevenueByProduct = Object.values(productRevenueMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopProducts(totalRevenueByProduct);

        // Calculate dashboard statistics
        calculateDashboardStats(ordersData, orderItemsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate dashboard statistics
  const calculateDashboardStats = (ordersData, orderItemsData) => {
    const dates = getDateRanges();
    // console.log(dates.today, ordersData);
    // Calculate order statistics
    const todayOrders = ordersData.filter(order =>

      order.order_date.split('T')[0] === dates.today
    );

    const yesterdayOrders = ordersData.filter(order =>
      order.order_date.split('T')[0] === dates.yesterday
    );

    const thisMonthOrders = ordersData.filter(order =>
      order.order_date >= dates.startOfMonth
    );

    // Calculate status counts
    const pendingOrders = ordersData.filter(order => order.status === 'pending' || order.status === 0).length;
    const processingOrders = ordersData.filter(order => order.status === 'processing' || order.status === 1).length;
    const deliveredOrders = ordersData.filter(order => order.status === 'delivered' || order.status === 2).length;
    // console.log(pendingOrders, processingOrders, deliveredOrders);
    // Calculate totals
    const calculateTotal = (orders) =>
      orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    setDashboardStats({
      todayOrders: {
        count: todayOrders.length,
        total: calculateTotal(todayOrders)
      },
      yesterdayOrders: {
        count: yesterdayOrders.length,
        total: calculateTotal(yesterdayOrders)
      },
      thisMonthOrders: {
        count: thisMonthOrders.length,
        total: calculateTotal(thisMonthOrders)
      },
      totalOrders: {
        count: ordersData.length,
        total: calculateTotal(ordersData)
      },
      pendingOrders,
      processingOrders,
      deliveredOrders,
    });

    // Calculate monthly statistics for chart
    calculateMonthlyStats(ordersData, orderItemsData);
  };

  // Calculate monthly statistics for charts
  const calculateMonthlyStats = (ordersData, orderItemsData) => {
    const currentYear = new Date().getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const categoryKeys = [
      'Disposable Vape',
      'Nicotine Pouches',
      'E-juice',
      'MYLE',
      'IQOS Iluma',
      'Juul & Pods System',
      'Heets & Terea',
      'Vape Kits',
    ];

    const monthlyData = months.map((month, index) => {
      // Orders for this month
      const monthOrders = ordersData.filter(order => {
        const orderDate = new Date(order.order_date);
        return orderDate.getFullYear() === currentYear && orderDate.getMonth() === index;
      });

      const monthOrderIds = monthOrders.map(order => order.id);

      // Order items for this month
      const monthOrderItems = orderItemsData.filter(item =>
        monthOrderIds.includes(item.order_id)
      );

      // Calculate revenue by category
      const categoryRevenue = {};
      categoryKeys.forEach(category => {
        categoryRevenue[category] = monthOrderItems
          .filter(item => item.category_name === category)
          .reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
      });

      // Total revenue for the month
      const totalRevenue = monthOrderItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)),
        0
      );

      return {
        month,
        ...categoryRevenue,
        total: totalRevenue
      };
    });

    setMonthlyStats(monthlyData);
  };
  // console.log("topProducts", topProducts);
  // Chart configurations
  const doughnutOptions = {
    data: {
      datasets: [
        {
          data: topProducts.map(product => product.revenue),
          backgroundColor: [
            "#10B981", "#3B82F6", "#F97316",
            "#F59E42", "#6366F1", "#EF4444", "#22D3EE"
          ].slice(0, topProducts.length), // Add more colors if needed
          label: "Revenue",
        },
      ],
      labels: topProducts.map(product => product.productName || `Product ${product.productId}`),
    },
    options: {
      responsive: true,
      cutout: "80%", // Chart.js v3+ uses 'cutout' instead of 'cutoutPercentage'
      plugins: {
        legend: {
          display: true, // Show legend for clarity
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: AED ${value}`;
            }
          }
        }
      }
    }
  };
  // console.log("monthlyStats", monthlyStats);
  const barOptions = {
    data: {
      labels: monthlyStats.map(stat => stat.month),
      datasets: [
        {
          label: "Disposable Vape",
          backgroundColor: "#10B981",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['Disposable Vape']),
        },
        {
          label: "Nicotine Pouches",
          backgroundColor: "#3B82F6",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['Nicotine Pouches']),
        },
        {
          label: "E-juice",
          backgroundColor: "#F97316",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['E-juice']),
        },
        {
          label: "MYLE",
          backgroundColor: "#0EA5E9",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['MYLE']),
        },
        {
          label: "IQOS Iluma",
          backgroundColor: "#ED2B2A",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['IQOS Iluma']),
        },
        {
          label: "Juul & Pods System",
          backgroundColor: "#76ABAE",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['Juul & Pods System']),
        },
        {
          label: "Heets & Terea",
          backgroundColor: "#DCD7C9",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['Heets & Terea']),
        },
        {
          label: "Vape Kits",
          backgroundColor: "#6EACDA",
          borderWidth: 1,
          data: monthlyStats.map(stat => stat['Vape Kits']),
        },

      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  };

  // Filter pending orders for the table
  const pendingOrdersData = orders.filter(order =>
    order.status === 'pending' || order.status === 0
  );

  // Handle status update
  const handleStatusChange = (orderId, newStatus) => {
    fetch('/api/orders', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Optionally update local state if needed
        // console.log("Status updated:", data);
        // setRefresh(!refresh);
        // console.log(data);
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        calculateDashboardStats(updatedOrders, orderItems);
        window.dispatchEvent(new Event("updateNotification"));
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>Dashboard Overview</PageTitle>

      <div className="grid gap-4 mb-8 md:grid-cols-4 xl:grid-cols-4">
        <CardItemTwo
          title="Today Order"
          Icon={<FaBoxOpen />}
          price={dashboardStats.todayOrders?.count?.toString() || 0}
          total={`${dashboardStats.todayOrders.total}`}
          className="text-white dark:text-green-100 bg-teal-500"
        />
        <CardItemTwo
          title="Yesterday Order"
          Icon={<FaShoppingCart />}
          price={dashboardStats.yesterdayOrders?.total}
          total={`${dashboardStats.yesterdayOrders.count.toString() || 0}`}
          className="text-white dark:text-green-100 bg-blue-500"
        />
        <CardItemTwo
          title="This Month"
          Icon={<FaShoppingCart />}
          price={dashboardStats.thisMonthOrders?.total}
          total={`${dashboardStats.thisMonthOrders.count.toString() || 0}`}
          className="text-white dark:text-green-100 bg-blue-500"
        />
        <CardItemTwo
          title="Total Order"
          Icon={<FaCreditCard />}
          price={dashboardStats.totalOrders?.total}
          total={`${dashboardStats.totalOrders.count.toString() || 0}`}
          className="text-white dark:text-green-100 bg-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardItem
          title="Total Orders"
          Icon={<FaShoppingCart />}
          quantity={dashboardStats.totalOrders?.count?.toString() || 0}
          className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
        />
        <CardItem
          title="Order Pending"
          Icon={<FaHourglassHalf />}
          quantity={dashboardStats.pendingOrders?.toString() || 0}
          className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
        />
        <CardItem
          title="Order Processing"
          Icon={<FaShippingFast />}
          quantity={dashboardStats.processingOrders?.toString() || 0}
          className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
        />
        <CardItem
          title="Order Delivered"
          Icon={<FaCheckCircle />}
          quantity={dashboardStats.deliveredOrders.toString()}
          className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 my-8">
        <Chart title="Revenue This Year">
          <Bar {...barOptions} />
        </Chart>
        <Chart title="Top Selling Products">
          <div className="w-70 h-70 mx-auto">
            <Doughnut {...doughnutOptions} />
          </div>
        </Chart>
      </div>

      {/* Top 5 Products Table */}
      <div className="my-8">
        <PageTitle>Top 5 Selling Products by Revenue</PageTitle>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue (AED)</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.productName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PageTitle>Pending Orders</PageTitle>
      <Windmill>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  INVOICE NO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ORDER TIME
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  METHOD
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  AMOUNT
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  STATUS
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingOrdersData.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {order.invoice_no}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {isMounted
                      ? new Date(order.order_date).toLocaleDateString('en-GB')
                      : order.order_date.split('T')[0]}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.method}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.total_amount} AED
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 2
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : order.status === 1
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : order.status === 3
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                    >
                      {order.status === 0 ? "Pending" : order.status === 1 ? "Accepted" : order.status === 2 ? "Delivered" : "Cancelled"}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className="select select-bordered w-full bg-white dark:bg-gray-800 focus:outline-none text-black dark:text-gray-100"
                      value={order.status} // controlled component
                      onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                    >
                      <option key={0} value={0}>Pending</option>
                      <option key={1} value={1}>Accepted</option>
                      <option key={2} value={2}>Delivered</option>
                      <option key={3} value={3}>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex justify-center">
                      {order?.invoice_no && (
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <button className="text-gray-500 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400" aria-label="View order">
                            <View size={25} />
                          </button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Windmill>
    </>
  );
};

export default Dashboardpage;