import { useQuery } from "@tanstack/react-query";
import { fetchAllCollections } from "../services/collections";

function useCollections() {
  const { data, isLoading, error } = useQuery({
    queryFn: fetchAllCollections,
    queryKey: ["collections"],
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error };
}

export default useCollections;
