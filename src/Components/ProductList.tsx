import React, { useState, useMemo } from "react";
import useFetch from "../customhooks/useFetch";
import useDebounce from "../customhooks/useDebounce";
import "../css/ProductList.css";

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
};

type ApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export default function ProductList() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  //memoizing results
  const url = useMemo(
    () =>
      `https://dummyjson.com/products/search?q=${encodeURIComponent(
        debouncedSearch
      )}&limit=10&skip=0`,
    [debouncedSearch]
  );

  //fetch using custom hooks
  const { data, loading, error } = useFetch<ApiResponse>(url);

  return (
    <div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p className="status-message">Loading...</p>}
      {error && <p className="status-message error">Error: {error.message}</p>}
      <div className="product-wrapper">
        <div className="product-container">
          {data?.products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.thumbnail} alt={p.title} loading="lazy" className="product-image" />
              <h3 className="product-title">{p.title}</h3>
              <p className="product-price">${p.price}</p>
              <p className="product-rating">⭐ {p.rating}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
