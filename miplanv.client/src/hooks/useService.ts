import { useState, useEffect } from "react";

export function useService<T>(delegate: () => Promise<T>, defaultValue: T, dependencies: any[])
:[boolean, string | null, T] {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T>(defaultValue);
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await delegate();
        setData(response);
        setError(null);
      }
      catch (error) {
        const errorTyped = error as Error;
        setError(errorTyped.message);
      }
      finally {
        setLoading(false);
      }
    }

    fetchData();
  }, dependencies);

  return [loading, error, data]
}