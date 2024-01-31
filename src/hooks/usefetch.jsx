import { useState, useEffect } from "react";

//custom hook
export const useFetch = (url) => {
  const [data, setData] = useState(null);

  //feratorando post
  const [config, setConfig] = useState(null);
  const [method, setMethod] = useState(null);
  const [callfetch, setCallFetch] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  

  const httpConfig = (data, method) => {
    setLoading(true);
    if (method === "POST") {
      setConfig({
        method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setMethod(method);
    }
  };

  const httpDelete = async (productId) => {
    setLoading(true);
    const res = await fetch(`${url}/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const json = await res.json();
      setCallFetch(json); // Aciona um recarregamento após a exclusão
    }
    setLoading(false);
  };

  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [url, callfetch]);

  //feratorando post
  useEffect(() => {
    const httpReq = async () => {
      if (method == "POST") {
        let fetchOptions = [url, config];

        const res = await fetch(...fetchOptions);

        const json = await res.json();

        setCallFetch(json);
      }
    };
    httpReq();
  }, [config, method, url]);

  return { data, httpConfig, httpDelete, loading, error };
};
