import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Card from "~/components/Card";
import Grid from "~/components/Grid";
import type { Product } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";

type LoaderData = {
  hasNextPage: boolean;
  products: Product[];
};

export const loader: LoaderFunction = async ({ request }) => {
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
      <h2>Products</h2>
      <Grid layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        {products.map((product: Product) => (
          <Card key={product.id}>
            <Link to={product.slug}>
              <h3>{product.title}</h3>
              <img src={product.image} alt={product.title} width="100%" />
            </Link>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
