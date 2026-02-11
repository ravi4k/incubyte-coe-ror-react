import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS, GET_CATEGORIES } from "../graphql/queries";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Debounce search to avoid excessive queries
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = useMemo(() => {
    let timeoutId;
    return (value) => {
      setSearch(value);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setDebouncedSearch(value), 300);
    };
  }, []);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      search: debouncedSearch || undefined,
      category: category || undefined,
    },
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  if (productsLoading) return <LoadingSpinner />;
  if (productsError) return <ErrorMessage message={productsError.message} />;

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  return (
    <div className="product-list-page">
      <div className="page-header">
        <h1>Products</h1>
        <p className="product-count">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      {products.length === 0 ? (
        <div className="no-results">
          <p>No products found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
