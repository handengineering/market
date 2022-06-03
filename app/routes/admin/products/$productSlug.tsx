import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";
import Image from "~/components/Image";
import { requireAdminPermissions } from "~/services/permissions.server";

type LoaderData = {
  product: FullProduct;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminPermissions(request);

  let productSlug = params.productSlug;

  invariant(productSlug, "Product slug not found");

  const product = await commerce.getProduct("en", productSlug);

  invariant(productSlug, "Product not found");

  return { product };
};

export default function Products() {
  const { product } = useLoaderData() as LoaderData;

  return (
    <div>
      <h1 className="mb-2 font-soehneBreit text-xl">Products</h1>
      <h2 className="mb-6">{product.title}</h2>
      <Image
        alt={product.title}
        src={product.image}
        className="mb-6 max-w-xl"
      />
      <p>{product.description}</p>
    </div>
  );
}
