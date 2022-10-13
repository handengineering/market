import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";

import { marked } from "marked";
import { useState } from "react";
import invariant from "tiny-invariant";
import Image from "~/components/Image";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import commerce from "~/services/commerce.server";

type LoaderData = {
  product: FullProduct;
  currentUrl: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let productSlug = params.productSlug;

  invariant(productSlug, "productSlug not found");

  const product = await commerce.getProduct("en", productSlug);

  invariant(productSlug, "productSlug found");

  const currentUrl = request.url;

  return { product, currentUrl };
};

export let meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderData;
  params: any;
}) => {
  const { product } = data;

  const { title, description, image } = product;

  const fullDescription = `${title}. ${description}`;

  return {
    title: `${title}`,
    description: fullDescription,
    "twitter:card": `${title}`,
    "twitter:site": "@haveanicedayeng",
    "twitter:title": `${title}`,
    "twitter:description": `${fullDescription}.`,
    "twitter:creator": "@haveanicedayeng",
    "twitter:image": image,
    "og:title": `${title} Raffle`,
    "og:type": "website",
    "og:url": data.currentUrl,
    "og:image": image,
    "og:description": fullDescription,
    "og:site_name": "Hand Engineering",
  };
};

export default function Index() {
  const { product } = useLoaderData() as unknown as LoaderData;
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const metafields = product.metafields.filter(Boolean);

  const componentsMetafield =
    metafields.length > 0 &&
    metafields.find((metafield) => metafield.key === "components");
  const accessoriesMetafield =
    metafields &&
    metafields.find((metafield) => metafield.key === "accessories");
  const dimensionsMetafield =
    metafields &&
    metafields.find((metafield) => metafield.key === "dimensions");
  const weightMetafield =
    metafields && metafields.find((metafield) => metafield.key === "weight");

  const dimensions =
    dimensionsMetafield && JSON.parse(dimensionsMetafield.value);
  const weight = weightMetafield && JSON.parse(weightMetafield.value);

  console.log({ product });

  return (
    <>
      <div className="mb-6 grid-cols-3 gap-16 md:grid">
        <div className="col-span-1 flex flex-col">
          <div>
            <h1 className="mb-6 font-soehneBreit text-2xl text-primary-500">
              {product.title}
            </h1>
            {product.descriptionHtml ? (
              <div
                className="mb-6"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : null}
          </div>
        </div>
        <div className="col-span-2">
          <Image
            src={selectedImage}
            alt={product.title}
            className="mb-6 aspect-video w-full object-cover"
          />
          <div className="mb-6 grid grid-cols-6 gap-6">
            {product.images.map((image, index) => {
              return (
                <Image
                  key={index}
                  src={image}
                  alt={product.title}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-square cursor-pointer object-cover transition-all hover:scale-95 hover:opacity-90"
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-6 md:flex-row">
        {componentsMetafield ? (
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(componentsMetafield?.value),
            }}
            className="prose prose-brand"
          />
        ) : null}
        {accessoriesMetafield ? (
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(accessoriesMetafield?.value),
            }}
            className="prose prose-brand"
          />
        ) : null}

        {dimensions ? (
          <div className="prose prose-brand">
            <h3>Dimensions</h3>
            <ul>
              <li>Width: {dimensions[0].value}mm</li>
              <li>Depth: {dimensions[1].value}mm</li>
              <li>Height: {dimensions[2].value}mm</li>
              <li>Weight: {weight.value}g</li>
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}
