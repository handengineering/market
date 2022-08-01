import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type {
  FullProduct,
  ProductVariant,
} from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";
import { requireAdminPermissions } from "~/services/permissions.server";
import type { SerialNumber } from "~/models/serialNumber.server";
import { createSerialNumbers } from "~/models/serialNumber.server";
import { getSerialNumbers } from "~/models/serialNumber.server";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Label from "~/components/Label";

type LoaderData = {
  product: FullProduct;
  productVariant: ProductVariant;
  matchingSerialNumbers?: SerialNumber[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminPermissions(request);

  let serialNumbers = await getSerialNumbers();

  let productSlug = params.productSlug;
  invariant(productSlug, "productSlug not found");

  let variantTitle = params.variantTitle;
  invariant(variantTitle, "variantTitle not found");

  const product = await commerce.getProduct("en", productSlug);

  invariant(product, "product not found");

  const productVariant = product.variants.find(
    (productVariant) =>
      productVariant.title.toLowerCase().replace(/ /g, "-") === variantTitle
  );

  invariant(productVariant, "productVariant not found");

  const matchingSerialNumbers = serialNumbers.filter(
    (serialNumber) => serialNumber.productVariantId === productVariant.id
  );

  return { product, productVariant, matchingSerialNumbers };
};

export const action: ActionFunction = async ({ request, params }) => {
  let productSlug = params.productSlug;
  invariant(productSlug, "productSlug not found");

  let variantTitle = params.variantTitle;
  invariant(variantTitle, "variantTitle not found");

  const product = await commerce.getProduct("en", productSlug);
  invariant(product, "product not found");

  const productVariant = product.variants.find(
    (productVariant) =>
      productVariant.title.toLowerCase().replace(/ /g, "-") === variantTitle
  );
  invariant(productVariant, "productVariant not found");

  invariant(productSlug, "productSlug not found");

  let formData = await request.formData();
  let count = formData.get("count");
  invariant(count, "count not found");

  await createSerialNumbers(
    parseInt(count.toString()),
    product.id,
    productVariant.id,
    null,
    null
  );

  return null;
};

export default function VariantTitle() {
  const { product, productVariant, matchingSerialNumbers } =
    useLoaderData() as LoaderData;

  console.log(matchingSerialNumbers);

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="mb-6 flex-1">
          <h1>{product.title}</h1>
          <h2 className="mb-6">{productVariant.title}</h2>
          <Form method="post">
            <Label htmlFor="count">Count</Label>
            <Input type="number" name="count" />
            <Button>Create Serial Numbers</Button>
          </Form>
        </div>
        {matchingSerialNumbers ? (
          <div className="mb-6 ">
            <table className="w-full table-fixed border border-neutral-500 font-soehneMono">
              <thead>
                <tr>
                  <th className="border border-neutral-500 p-2">
                    Serial Number ID
                  </th>
                  <th className="border border-neutral-500 p-2">
                    Serial Number
                  </th>
                  <th className="border border-neutral-500 p-2">Product ID</th>
                  <th className="border border-neutral-500 p-2">Variant ID</th>
                  <th className="border border-neutral-500 p-2">User ID</th>
                  <th className="border border-neutral-500 p-2">Order ID</th>
                </tr>
              </thead>
              <tbody>
                {matchingSerialNumbers.map((matchingSerialNumber) => {
                  const {
                    id,
                    serialNumber,
                    productId,
                    productVariantId,
                    userId,
                    orderId,
                  } = matchingSerialNumber;

                  return (
                    <tr key={id}>
                      <td className="truncate border border-neutral-500 p-2">
                        {id}
                      </td>
                      <td className="truncate border border-neutral-500 p-2">
                        {serialNumber}
                      </td>
                      <td className="truncate border border-neutral-500 p-2">
                        {productId}
                      </td>
                      <td className="truncate border border-neutral-500 p-2">
                        {productVariantId}
                      </td>
                      <td className="truncate border border-neutral-500 p-2">
                        {userId ? userId : "Undefined"}
                      </td>
                      <td className="truncate border border-neutral-500 p-2">
                        {orderId ? orderId : "Undefined"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
