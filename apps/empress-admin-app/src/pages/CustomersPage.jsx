import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, Close, Delete, Search, Visibility } from "@mui/icons-material";

import CustomersTable from "../features/customer/CustomersTable";
import Heading from "../ui/Heading";
import Modal from "../ui/Modal";
import ConfirmDelete from "../ui/ConfirmDelete";
import useCustomers from "../hooks/useCustomers";
import Spinner from "../ui/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCustomer } from "../services/customers";

function CustomerPage() {
  const navigate = useNavigate();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const { data: customersData, isLoading, error } = useCustomers();

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(response.message);
        setSelectedRowId(null);
      } else {
        toast.error(response.message);
        setSelectedRowId(null);
      }
      queryClient.invalidateQueries("customers");
    },
    onError: () => {
      toast.error("An error occurred. Please try again later.");
    },
  });

  useEffect(() => {
    if (customersData) {
      setRows(
        customersData.map((customer) => ({
          ...customer,
          id: customer._id,
        })),
      );
    }
  }, [customersData]);

  const filteredRows = rows.filter((customer) => {
    return (
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  console.log("filteredRows", filteredRows);

  return (
    <div className="bg-[#F8FAFC] px-6 py-4">
      <Modal>
        <Modal.Window />
        <div className="mb-6 flex items-center justify-between">
          <Heading level={2} text="Customers List" />
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 rounded-md bg-[#D9EAFD] p-4 shadow-sm">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full rounded-md border border-[#BCCCDC] px-4 py-2 text-[#3C4048] focus:ring-2 focus:ring-[#1E96FC] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <Search />
              </div>
            </div>
          </div>

          {!selectedRowId ? null : (
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1 rounded bg-[#F6F1F1] px-4 py-2 text-[#19A7CE] transition-all hover:bg-[#EAEAEA]"
                onClick={() => navigate(`/customers/${selectedRowId}`)}
              >
                <Visibility sx={{ fontSize: "16px" }} />
                <span className="text-sm font-medium">View</span>
              </button>

              <Modal.Open
                content={
                  <ConfirmDelete
                    item={
                      filteredRows
                        .filter((row) => row._id === selectedRowId)
                        .map((row) => {
                          return {
                            id: row._id,
                            name: `${row.firstName} ${row.lastName}`,
                            email: row.email,
                          };
                        })[0]
                    }
                    closeModal={
                      <Modal.Close>
                        <button className="flex items-center gap-1 rounded bg-[#F0F4F8] px-4 py-2 text-[#3C4048] transition-all hover:bg-[#E1E9F1]">
                          <Close sx={{ fontSize: "16px" }} />
                          <span className="text-sm font-medium">Close</span>
                        </button>
                      </Modal.Close>
                    }
                    onDelete={() => mutation.mutate(selectedRowId)}
                  />
                }
              >
                <button className="flex items-center gap-1 rounded bg-[#FFDB57] px-4 py-2 text-[#146C94] transition-all hover:bg-[#FFCB05]">
                  <Delete sx={{ fontSize: "16px" }} />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </Modal.Open>
            </div>
          )}

          <CustomersTable
            rows={filteredRows}
            setSelectedRowId={setSelectedRowId}
          />
        </div>
      </Modal>
    </div>
  );
}

export default CustomerPage;
