import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";
import { requireAdminPermissions } from "~/services/permissions.server";

type LoaderData = {
  product: FullProduct;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminPermissions(request);

  let productSlug = params.productSlug;

  invariant(productSlug, "productSlug not found");

  const product = await commerce.getProduct("en", productSlug);

  invariant(productSlug, "productSlug found");

  return { product };
};

export default function ProductSlug() {
  const { product } = useLoaderData() as LoaderData;

  return (
    <div>
      <h1 className="mb-2 font-soehneBreit text-xl">Products</h1>
      <h2 className="mb-8">{product.title}</h2>

      <ul>
        {product.variants.map((productVariant) => {
          return (
            <li key={productVariant.id} className="mb-4">
              <Link
                to={productVariant.title
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/(?:-)+/g, "-")}
              >
                {productVariant.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
