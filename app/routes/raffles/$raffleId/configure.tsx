import type { RaffleEntryProduct } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { isAfter, isBefore } from "date-fns";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import Image from "~/components/Image";
import ProductDetails from "~/components/ProductDetails";
import type { SelectedOptions } from "~/components/ProductOptionInputs";
import ProductOptionInputs from "~/components/ProductOptionInputs";
import type {
  FullProduct,
  ProductVariant,
  SelectedProductOption,
} from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffleById } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { deleteRaffleEntriesByRaffleIdAndUserId } from "~/models/raffleEntry.server";
import { createRaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import {
  createRaffleEntryProduct,
  getRaffleEntryProductsByRaffleEntryId,
} from "~/models/raffleEntryProduct.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import { getMatchingVariant } from "~/utils/product";

type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };

type LoaderData = {
  raffleWithMatchingProducts?: RaffleWithMatchingProducts;
  raffleEntry?: RaffleEntry;
  raffleEntryProducts?: RaffleEntryProduct[];
  selectedVariant?: ProductVariant;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const raffleId = params.raffleId as string;
  const raffle: Raffle | null = await getRaffleById(raffleId);
  const raffleEntries = await getRaffleEntriesByUserId(user.id);
  const currentDateTime = new Date();

  if (!raffle) {
    return redirect("/raffles");
  }

  if (
    isBefore(currentDateTime, new Date(raffle?.startDateTime)) ||
    isAfter(currentDateTime, new Date(raffle?.endDateTime))
  ) {
    return redirect(`/raffles/${raffle.id}`);
  }
  const raffleEntry: RaffleEntry | undefined = raffleEntries.find(
    (raffleEntry) =>
      raffleEntry.userId === user.id && raffleEntry.raffleId === raffleId
  );

  const products =
    raffle &&
    (await Promise.all(
      raffle.productSlugs.map(async (productSlug) => {
        const product = await commerce.getProduct("en", productSlug);
        return product;
      })
    ));

  const product = products && products[0];

  const raffleEntryProducts =
    raffleEntry &&
    (await getRaffleEntryProductsByRaffleEntryId(raffleEntry?.id));

  const raffleEntryProduct = raffleEntryProducts && raffleEntryProducts[0];

  const selectedVariant = product?.variants.find(
    (variant) => variant.id === raffleEntryProduct?.productVariantId
  );

  const raffleWithMatchingProducts = {
    ...raffle,
    products: products,
  };

  return {
    raffleWithMatchingProducts,
    raffleEntry,
    selectedVariant,
  };
};

export let action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const raffleId = params.raffleId as string;
  const raffle: Raffle | null = await getRaffleById(raffleId);

  invariant(raffle, "Raffle not found");

  const matchingProducts = await Promise.all(
    raffle.productSlugs.map(async (productSlug) => {
      const product = await commerce.getProduct("en", productSlug);
      return product;
    })
  );

  const product = matchingProducts[0];

  let formData = await request.formData();
  let formDataEntries = [...formData.entries()];

  let options: SelectedProductOption[] = formDataEntries
    .filter((formDataEntry) => {
      return JSON.parse(formDataEntry[0]).type === "option";
    })
    .map((formDataEntry) => {
      return {
        name: JSON.parse(formDataEntry[0]).name,
        value: formDataEntry[1].toString(),
      };
    });

  let matchingVariant = getMatchingVariant(options, product);

  await deleteRaffleEntriesByRaffleIdAndUserId(raffle.id, user.id);

  let raffleEntry = await createRaffleEntry(raffleId, user.id);

  return (
    product &&
    matchingVariant &&
    createRaffleEntryProduct(product.id, matchingVariant.id, raffleEntry.id)
  );
};

export let ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <div>{error.message}</div>
);

export default function Configure() {
  const { raffleWithMatchingProducts, raffleEntry, selectedVariant } =
    useLoaderData() as LoaderData;

  const product = raffleWithMatchingProducts?.products[0];

  const initialVariant = product?.variants.find(
    (productVariant) => productVariant.id === product.defaultVariantId
  );

  const initialOptions: SelectedOptions | undefined =
    initialVariant?.selectedOptions.reduce((total, selectedOption) => {
      return { [selectedOption.name]: selectedOption.value, ...total };
    }, {});

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    initialOptions || {}
  );

  const handleSelectedOptionChange = (option: SelectedProductOption) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [option.name]: option.value,
    };

    setSelectedOptions(newSelectedOptions);
  };

  useEffect(() => {
    const newOptions: SelectedOptions | undefined =
      selectedVariant?.selectedOptions.reduce((total, selectedOption) => {
        return { [selectedOption.name]: selectedOption.value, ...total };
      }, {});

    newOptions && setSelectedOptions(newOptions);
  }, [selectedVariant]);

  const secondaryImages = product?.images.slice(1);

  const firstProduct =
    raffleWithMatchingProducts && raffleWithMatchingProducts.products[0];

  if (!firstProduct) {
    return redirect("/raffles");
  }

  const { descriptionHtml } = firstProduct;

  return product ? (
    <Form method="post">
      <div className="mb-6 flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 flex-col items-start gap-6">
          <Image src={product.image} />
        </div>
        <div className="flex w-full max-w-xs flex-initial flex-col justify-between">
          <div className="mb-6">
            <h1 className="mb-2 font-soehneBreit text-2xl ">
              {raffleWithMatchingProducts?.name}
            </h1>
            <p className="mb-6 font-soehneBreit text-xl ">
              {raffleWithMatchingProducts.products[0].formattedPrice}
            </p>
            <div>
              {product?.options.map((option) => {
                return (
                  <ProductOptionInputs
                    key={option.name}
                    option={option}
                    product={product}
                    onChange={handleSelectedOptionChange}
                    selectedOptions={selectedOptions}
                  />
                );
              })}
            </div>
          </div>
          <Button
            color={raffleEntry ? undefined : "primary"}
            size="large"
            disabled={!!raffleEntry}
          >
            {raffleEntry ? "Raffle Entry Submitted" : "Submit Options"}
          </Button>
        </div>
      </div>
      <div className="mb-12 flex flex-1 items-center justify-between">
        {Object.keys(selectedOptions).length !== 0 ? (
          <ul className="mb-0 flex">
            {Object.keys(selectedOptions).map((selectedOptionKey) => {
              return (
                <li key={selectedOptionKey} className="mr-6">
                  <b>{selectedOptionKey}</b>{" "}
                  {selectedOptions[selectedOptionKey]}
                </li>
              );
            })}
          </ul>
        ) : (
          "No options specified"
        )}
      </div>
      <div>
        {descriptionHtml ? (
          <div
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
            className="prose prose-brand mb-12 max-w-none rounded bg-neutral-200 p-6"
          />
        ) : null}

        {secondaryImages
          ? secondaryImages.map((image, index) => {
              return <Image key={index} src={image} className="mb-6" />;
            })
          : null}

        <ProductDetails metafields={product.metafields} />
      </div>
    </Form>
  ) : null;
}
