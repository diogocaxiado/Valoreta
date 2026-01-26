import { useQuery } from "@tanstack/react-query";

interface useCallApiProps {
  endpoint: string;
  filters?: { [key: string]: string | boolean | number };
}

export default function useCallApi<T>({ endpoint, filters }: useCallApiProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["datakey", endpoint, filters],
    queryFn: async () => {
      const baseUrl = process.env.VITE_API_URL;

      const processedFilters = Object.entries(filters || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as { [key: string]: string }
      );

      const params = new URLSearchParams(processedFilters).toString();
      const response = await fetch(`${baseUrl}${endpoint}?${params}`);

      if (!response.ok) {
        throw new Error(`Falha na chamada dos dados`);
      }

      const result = await response.json();
      return result.data as T;
    },
  });

  return { data, isLoading, error };
}
