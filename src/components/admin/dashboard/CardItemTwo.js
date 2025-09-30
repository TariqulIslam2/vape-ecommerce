"use client";
import React from "react";
import { Card, CardBody } from "@windmill/react-ui";

const CardItemTwo = ({ title, Icon, className, price, total }) => {

  return (
    <>
      <Card className="flex justify-center text-center h-full">
        <CardBody
          className={`border border-gray-200 dark:border-gray-800 w-full p-6 rounded-lg ${className}`}
        >
          <div className={`text-center inline-block text-3xl ${className}`}>
            <div className="text-3xl">{Icon}</div>
          </div>
          <div>
            <p className="mb-3 text-base font-medium text-gray-50 dark:text-gray-100">
              {title}
            </p>
            <div className="flex justify-between items-center h-10">
              {" "}
              {/* Set a height for the parent container */}
              <p className="text-2xl font-bold leading-none text-gray-50 dark:text-gray-50">
                {total}
              </p>
              <div className="border-l-2 border-gray-100 h-full mx-4"></div>{" "}
              {/* Vertical line */}
              <p className="text-2xl font-bold leading-none text-gray-50 dark:text-gray-50">
                {Math.round(price)} AED
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default CardItemTwo;
