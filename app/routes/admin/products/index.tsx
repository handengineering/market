import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Image from "~/components/Image";
import type { Product } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";
import { requireAdminPermissions } from "~/services/permissions.server";

type LoaderData = {
  hasNextPage: boolean;
  products: Product[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminPermissions(request);

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
      <h2 className="mb-6 font-soehneBreit text-lg">Products</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product: Product) => (
          <div key={product.id} className="mb-6">
            <Link to={product.slug}>
              <h3 className="mb-6">{product.title}</h3>
              <Image src={product.image} alt={product.title} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
