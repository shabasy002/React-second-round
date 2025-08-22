import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, expect, test, vi } from "vitest";

// Mock CSS so Vite/Vitest doesn’t try to load it
vi.mock("../Css/ProductList.css", () => ({}));


// ---- Mocks ----
vi.mock("../CustomHooks/Usefetch", () => ({
  default: vi.fn(),
}));
vi.mock("../CustomHooks/Usedebounce", () => ({
  // debounce pass-through for tests (no timing)
  default: vi.fn((v: string) => v),
}));

// Import after mocks
import ProductList from "./ProductList";
import useFetch from "../CustomHooks/Usefetch";
import useDebounce from "../CustomHooks/Usedebounce";

beforeEach(() => {
  (useFetch as any).mockReset?.();
  (useDebounce as any).mockReset?.();
});

// helper to build a product
const product = (id: number, title = `Item ${id}`) => ({
  id,
  title,
  price: 99.99,
  rating: 4.2,
  thumbnail: "https://example.com/img.jpg",
});

test("shows loading state", () => {
  (useFetch as any).mockReturnValue({
    data: null,
    loading: true,
    error: null,
  });

  render(<ProductList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("shows error state", () => {
  (useFetch as any).mockReturnValue({
    data: null,
    loading: false,
    error: new Error("Network down"),
  });

  render(<ProductList />);
  expect(screen.getByText(/error: network down/i)).toBeInTheDocument();
});

test("renders product titles when data is available", () => {
  (useFetch as any).mockReturnValue({
    data: {
      products: [product(1, "Red Nail Polish"), product(2, "Gucci Bloom")],
      total: 2,
      skip: 0,
      limit: 10,
    },
    loading: false,
    error: null,
  });

  render(<ProductList />);
  expect(screen.getByText("Red Nail Polish")).toBeInTheDocument();
  expect(screen.getByText("Gucci Bloom")).toBeInTheDocument();
});

test("typing in search updates q in the URL passed to useFetch", () => {
  (useDebounce as any).mockImplementation((v: string) => v);
  (useFetch as any).mockReturnValue({
    data: { products: [], total: 0, skip: 0, limit: 10 },
    loading: false,
    error: null,
  });

  render(<ProductList />);

  const input = screen.getByPlaceholderText(/search products/i);
  fireEvent.change(input, { target: { value: "gucci" } });

  const calls = (useFetch as any).mock.calls;
  const lastCall = calls[calls.length - 1];
  const urlArg: string = lastCall[0];

  expect(urlArg).toContain("https://dummyjson.com/products/search?");
  expect(urlArg).toContain("q=gucci");
  expect(urlArg).toContain("limit=10");
  expect(urlArg).toContain("skip=0");
});
