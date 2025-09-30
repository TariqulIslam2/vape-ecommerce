"use client";

import React from "react";

import { Button } from "@windmill/react-ui";
import { ImFacebook, ImGoogle } from "react-icons/im";

import LabelArea from "@/components/admin/form/LabelArea";
import Error from "@/components/admin/form/Error";
import InputArea from "@/components/admin/form/InputArea";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn, useSession, getSession } from "next-auth/react"
import { toast } from "react-toastify";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    // console.log("Form Data", data);
    const { email, password } = data;
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    // console.log("result", result);
    if (result.ok) {
      // console.log(result.ok);
      // Fetch session to get user role
      const session = await getSession();
      // toast.success("Login successful");
      if (session?.user?.role === 3) {
        toast.success("Login successful");
        setTimeout(() => {
          router.push("/userdashboard");
        }, 1500); // 1 সেকেন্ড পরে রিডাইরেক্ট
      } else if (session?.user?.role === 1 || session?.user?.role === 2) {
        toast.success("Login successful");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error("Unknown user role");
      }
    } else {
      toast.error("Invalid email or password");
    }

  };
  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src="/login-office.jpeg"
                alt="login-Office"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src="/login-office.jpeg"
                alt="login-office"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <LabelArea label="Email" />
                  <InputArea
                    register={register}
                    // defaultValue="admin@gmail.com"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@gmail.com"
                  />
                  <Error errorName={errors.email} />
                  <div className="mt-6"></div>
                  <LabelArea label="Password" />
                  <InputArea
                    register={register}
                    // defaultValue="1234567123"
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="**********"
                  />
                  <Error errorName={errors.password} />

                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-4 h-12 w-full bgColor"
                    to="/dashboard"
                  >
                    Log in
                  </Button>
                  <hr className="my-10 hidden" />
                  <button
                    disabled
                    className="hidden text-sm items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2 md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-blue-600 h-11 md:h-12 w-full mr-2"
                    aria-label="Login With Facebook"
                  >
                    <ImFacebook className="w-4 h-4 mr-2" />{" "}
                    <span className="ml-2">Login With Facebook</span>
                  </button>
                  <button
                    disabled
                    className="hidden text-sm items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full"
                    aria-label="Login With Google"
                  >
                    <ImGoogle className="w-4 h-4 mr-2" />{" "}
                    <span className="ml-2">Login With Google</span>
                  </button>
                </form>

                <p className="mt-4">
                  {/* <Link
                    className="text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                    href="/forgot-password"
                    aria-label="Forgot password"
                  >
                    Forgot your password?
                  </Link> */}
                </p>
                <p className="mt-1">
                  <Link
                    className="hidden text-sm font-medium text-green-500 dark:text-green-400 hover:underline"
                    href="/signup"
                    aria-label="Create account"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
