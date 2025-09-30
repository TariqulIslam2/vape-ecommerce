"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CheckOutPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "UAE",
    phone: "",
    email: "",
    notes: "",
    password: "",
  });
  const { data, status } = useSession()
  // console.log(data);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(30);
  const [createAccount, setCreateAccount] = useState(false);
  const router = useRouter();
  const cities = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Al Ain",
    "Fujairah",
  ];
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (storedCart.length === 0) {
      router.push("/");
    }
    else {
      setCartItems(storedCart);

      const total = storedCart?.reduce(
        (acc, item) => acc + (item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price) * item.quantity,
        0
      );
      setSubtotal(total);
    }
  }, []);

  useEffect(() => {
    if (["Dubai", "Sharjah", "Ajman"].includes(form.city)) {
      setShippingFee(25);
    } else if (form.city) {
      setShippingFee(30);
    }
  }, [form.city]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    // Email regex (simple version)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Phone regex (10-15 digits, numbers only)
    const phoneRegex = /^\d{10,15}$/;
    // Name regex (letters and spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;

    // First Name
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!nameRegex.test(form.firstName.trim())) {
      newErrors.firstName = "First name should contain only letters";
    }

    // Address
    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    // City
    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    // Phone
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (10-15 digits)";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Password (if creating account)
    if (createAccount) {
      if (!form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (!paymentMethod) newErrors.paymentMethod = "Select a payment method";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderPayload = {
      ...form,
      method: paymentMethod,
      live_location: "", // Add this if needed
      users_id: 1, // Replace with actual logged-in user ID
      cartItems,
      shippingFee,
      total_amount: subtotal + shippingFee,
      createAccount
    };
    // console.log(orderPayload)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        setCartItems([]);
        setSubtotal(0);
        router.push("/");
      } else {
        const { error } = await res.json();
        alert("Order failed: " + error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 dark:bg-gray-900 py-10">
      <div className="w-full max-w-screen-xl px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing Details */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-xl space-y-6 max-w-2xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Billing Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-gray-700 dark:text-gray-200">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 ${errors.firstName && "input-error border-red-500 dark:border-red-400"}`}
                />
                {errors.firstName && (
                  <p className="text-error dark:text-red-300 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="label text-gray-700 dark:text-gray-200">Last Name </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="label text-gray-700 dark:text-gray-200">Street Address *</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 ${errors.address && "input-error border-red-500 dark:border-red-400"}`}
              />
              {errors.address && (
                <p className="text-error dark:text-red-300 text-xs">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-gray-700 dark:text-gray-200">Town / City *</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 ${errors.city && "input-error border-red-500 dark:border-red-400"}`}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-error dark:text-red-300 text-xs">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="label text-gray-700 dark:text-gray-200">State / Country</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  // onChange={handleChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="label text-gray-700 dark:text-gray-200">Phone *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 ${errors.phone && "input-error border-red-500 dark:border-red-400"}`}
              />
              {errors.phone && (
                <p className="text-error dark:text-red-300 text-xs">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="label text-gray-700 dark:text-gray-200">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 ${errors.email && "input-error border-red-500 dark:border-red-400"}`}
              />
              {errors.email && (
                <p className="text-error dark:text-red-300 text-xs">{errors.email}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={createAccount}
                  onChange={() => setCreateAccount(!createAccount)}
                  className="checkbox"
                />
                <label htmlFor="createAccount" className="label-text text-gray-700 dark:text-gray-200">Create an account?</label>
              </div>
              {createAccount && (
                <div className="mt-2">
                  <label className="label text-gray-700 dark:text-gray-200">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 ${errors.password && "input-error border-red-500 dark:border-red-400"}`}
                  />
                  {errors.password && (
                    <p className="text-error dark:text-red-300 text-xs">{errors.password}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="label text-gray-700 dark:text-gray-200">Order Notes (optional)</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes about your order, delivery instructions..."
                className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700"
              />
            </div>
          </form>

          {/* Order Summary (Payment Card) */}
          <div className="sticky top-4 h-fit bg-white dark:bg-gray-800 p-8 shadow-lg rounded-xl max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Order</h2>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4 space-y-4 max-h-72 overflow-y-auto">
              {cartItems?.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-sm w-3/4 whitespace-wrap text-gray-900 dark:text-gray-100">
                      {item.product_name} (x{item.quantity})
                    </p>
                    <span className="badge badge-ghost badge-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      {(item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price) * item.quantity} د.إ
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {
                      item.selectedFlavor && (
                        <p>Flavor: {item.selectedFlavor}</p>
                      )
                    }
                    {
                      item.selectedOffer && (
                        <p>Offer: {item.selectedOffer}</p>
                      )
                    }
                    {
                      item.selectedColor && (
                        <p>Color: {item.selectedColor}</p>
                      )
                    }
                    {
                      item.selectedNicotine && (
                        <p>Nicotine: {item.selectedNicotine}</p>
                      )
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100">{subtotal.toFixed(2)} د.إ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Shipping</span>
                <span className="text-gray-900 dark:text-gray-100">{shippingFee} د.إ</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-green-600 dark:text-green-400">
                  {(subtotal + shippingFee).toFixed(2)} د.إ
                </span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="label font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Payment Method <span className="text-error dark:text-red-300">*</span>
              </label>
              {
                ["Dubai", "Sharjah", "Ajman"].includes(form.city) ? (
                  <div className="form-control space-y-4">
                    <div>
                      <label className="label cursor-pointer text-wrap text-gray-900 dark:text-gray-100">
                        <input
                          type="radio"
                          name="payment"
                          value="COD"
                          className="radio checked:bg-dark dark:checked:bg-gray-700"
                          checked={paymentMethod === "COD"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="label-text ml-2 text-gray-900 dark:text-gray-100">
                          Cash on delivery
                        </span>
                      </label>
                    </div>

                    <div>  <label className="label cursor-pointer text-wrap text-gray-900 dark:text-gray-100">
                      <input
                        type="radio"
                        name="payment"
                        value="Card"
                        className="radio checked:bg-dark dark:checked:bg-gray-700"
                        checked={paymentMethod === "Card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="label-text ml-2 text-gray-900 dark:text-gray-100">
                        Card Payment
                      </span>
                    </label></div>
                    <div> <label className="label cursor-pointer text-wrap text-gray-900 dark:text-gray-100">
                      <input
                        type="radio"
                        name="payment"
                        value="Bank Transfer"
                        className="radio checked:bg-dark dark:checked:bg-gray-700"
                        checked={paymentMethod === "Bank Transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="label-text ml-2 text-gray-900 dark:text-gray-100">
                        Bank Transfer
                      </span>
                    </label></div>
                    {errors.paymentMethod && (
                      <p className="text-error dark:text-red-300 text-xs">{errors.paymentMethod}</p>
                    )}
                  </div>
                ) : (<div className="form-control space-y-4">
                  <div>
                    <label className="label cursor-pointer text-wrap text-gray-900 dark:text-gray-100">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        className="radio checked:bg-dark dark:checked:bg-gray-700"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="label-text ml-2 text-gray-900 dark:text-gray-100">
                        Cash on delivery
                      </span>
                    </label>
                  </div>

                  {errors.paymentMethod && (
                    <p className="text-error dark:text-red-300 text-xs">{errors.paymentMethod}</p>
                  )}
                </div>)
              }

            </div>

            {/* Terms and Place Order */}
            <div className="mt-6 space-y-4">
              {/* <label className="label cursor-pointer text-wrap">
                <input type="checkbox" required className="checkbox mr-2" />
                <span className="label-text ">
                  I agree to the <a className="link">terms & conditions</a>
                </span>
              </label> */}

              <button
                type="submit"
                aria-label="Place Order"
                onClick={handleSubmit}
                className="btn w-full bgColor  text-white text-lg"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
