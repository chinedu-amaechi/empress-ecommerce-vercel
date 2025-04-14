import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Message, BarChart } from "@mui/icons-material"; // Icons kept from Material UI
import Spinner from "../ui/Spinner"; // Assuming you have a Spinner component
import { fetchCustomer } from "../services/customers"; // Assuming you have a function to fetch customer data
import Heading from "../ui/Heading";

const CustomerDetailPage = () => {
  const { id } = useParams(); // Get the customer ID from URL
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomer(id); // Fetch the customer details from API
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Spinner />; // Show loading spinner while fetching data

  if (!customer)
    return (
      <div className="text-center text-xl text-red-500">Customer not found</div>
    ); // Handle the case where the customer is not found

  // Calculate user analysis: total spent and number of items bought
  const totalSpent = 0; // Default to 0 if no purchases
  const itemsBought = 0; // Default to 0 if no purchases

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-lg">
      {/* Page Title */}
      <div className="mb-6 flex items-center justify-between">
        <Heading
          level={1}
          text={`${customer.firstName} ${customer.lastName}`}
        />
      </div>

      {/* Basic Information Section */}
      <section className="mb-8">
        <Heading level={2} text="Basic Information" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Heading level={3} text="Email" />
            <p className="text-gray-700">{customer.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Phone</h3>
            <p className="text-gray-700">{customer.phone}</p>
          </div>
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-600">Address</h3>
            <p className="text-gray-700">
              {customer.address.street}, {customer.address.city},{" "}
              {customer.address.province}, {customer.address.country},{" "}
              {customer.address.postalCode}
            </p>
          </div>
        </div>
      </section>

      {/* User Analysis Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-medium text-gray-700">
          User Analysis
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              Total Amount Spent
            </h3>
            <p className="text-gray-700">${totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              Number of Items Bought
            </h3>
            <p className="text-gray-700">{itemsBought}</p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section>
        <h2 className="mb-4 text-2xl font-medium text-gray-700">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="flex w-full items-center rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-700 sm:w-auto"
            onClick={() => alert("Send message functionality goes here")}
          >
            <Message className="mr-2" />
            Send Message
          </button>
          <button
            className="flex w-full items-center rounded-lg bg-gray-600 px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-gray-700 sm:w-auto"
            onClick={() => alert("Show user analysis details")}
          >
            <BarChart className="mr-2" />
            User Analysis
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomerDetailPage;
