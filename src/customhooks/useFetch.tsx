import { useState, useEffect } from "react";

function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch((err: Error) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {//clearing mount
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
