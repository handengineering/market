import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { Product } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";

type LoaderData = {
  hasNextPage: boolean;
  products: Product[];
};

export const loader: LoaderFunction = async () => {
  const productsResponse = await commerce.getProducts(
    "en",
    undefined,
    undefined,
    undefined,
    undefined,
    100,
    undefined
  );

  const { hasNextPage, products } = productsResponse;

  return { hasNextPage, products };
};

export default function Products() {
  const { products } = useLoaderData() as LoaderData;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product: Product) => (
          <li key={product.id}>
            <h3>{product.title}</h3>
            <img src={product.image} alt={product.title} width="320px" />
          </li>
        ))}
      </ul>
    </div>
  );
}
