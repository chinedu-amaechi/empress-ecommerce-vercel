import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "../services/products";

export default function useProducts() {
  const { data, error, isLoading } = useQuery({
    queryFn: fetchAllProducts,
    queryKey: ["products"],
    refetchOnWindowFocus: true,
  });

  return { data, error, isLoading };
}
