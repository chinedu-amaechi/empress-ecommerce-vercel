import { useQuery } from "@tanstack/react-query";
import { fetchAllCustomers } from "../services/customers";

export default function useCustomers() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchAllCustomers,
  });

  return {
    data,
    isLoading,
    error,
  };
}
