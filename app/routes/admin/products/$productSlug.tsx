import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import permissions from "prisma/permissions";
import invariant from "tiny-invariant";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";
import { checkPermissions } from "~/services/permissions.server";

type LoaderData = {
  product: FullProduct;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const hasPermissions = await checkPermissions(
    request,
    permissions.administrator
  );

  let productSlug = params.productSlug;

  invariant(productSlug, "Product slug not found");

  if (!hasPermissions) return redirect("/dashboard");

  const product = await commerce.getProduct("en", productSlug);

  invariant(productSlug, "Product not found");

  return { product };
};

export default function Products() {
  const { product } = useLoaderData() as LoaderData;
  console.log(product);

  return (
    <div>
      <h1>Products</h1>
      <h1>{product.title}</h1>
      <img width="320px" alt={product.title} src={product.image} />
      <p>{product.description}</p>
    </div>
  );
}
