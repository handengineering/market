import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import React, { useState } from "react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import FlexContainer from "~/components/FlexContainer";
import Image from "~/components/Image";
import Label from "~/components/Label";
import Select, { Option } from "~/components/Select";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import { getRaffleById } from "~/models/raffle.server";
import { getRaffleEntriesByRaffleIdAndUserId } from "~/models/raffleEntry.server";
import { getRaffleEntryProductsByRaffleEntryId } from "~/models/raffleEntryProduct.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import {
  getSelectedAccessories,
  getSelectedAccessoriesWithOptions,
} from "~/utils/product";
import type { ParsedFormDataEntryValue } from "~/utils/raffleEntryProduct";
import {
  serializeFormDataOptionQuantities,
  serializeFormDataQuantities,
} from "~/utils/raffleEntryProduct";

const accessoryCount = 5;

export interface ActionData {
  checkoutUrl?: string;
}

export interface LoaderData {
  product: FullProduct;
  matchingAccessories?: FullProduct[];
}

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const raffleId = params.raffleId as string;

  const raffleEntries = await getRaffleEntriesByRaffleIdAndUserId(
    raffleId,
    user.id
  );

  const raffleEntry = raffleEntries[0];

  if (!raffleEntry || raffleEntry.status !== "DRAWN") {
    return redirect("/");
  }

  const raffle = await getRaffleById(raffleEntry.raffleId);

  invariant(raffle, "raffle not found");

  const productSlug = raffle.productSlugs[0];

  invariant(productSlug, "productSlug not found");

  const product = await commerce.getProduct("en", productSlug);

  invariant(product, "product not found");

  const mainProductTag = product.tags[0];

  const getProductsResponse = await commerce.getProducts(
    "en",
    undefined,
    undefined,
    `"${mainProductTag}"`
  );

  const matchingAccessories = getProductsResponse.products.filter((product) => {
    return product.tags && product.tags.includes("Accessories");
  });

  const fullMatchingAccessoriesPromises = matchingAccessories.map(
    async (accessory) => await commerce.getProduct("en", accessory.slug)
  );

  const fullMatchingAccessories = await Promise.all(
    fullMatchingAccessoriesPromises
  );

  return { product, matchingAccessories: fullMatchingAccessories };
};

export let action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const raffleId = params.raffleId as string;

  const raffleEntries = await getRaffleEntriesByRaffleIdAndUserId(
    raffleId,
    user.id
  );

  const raffleEntry = raffleEntries[0];

  const raffle = await getRaffleById(raffleEntry.raffleId);

  invariant(raffle, "raffle not found");

  const productSlug = raffle.productSlugs[0];

  invariant(productSlug, "productSlug not found");

  const product = await commerce.getProduct("en", productSlug);

  invariant(product, "product not found");

  const raffleEntryProducts = await getRaffleEntryProductsByRaffleEntryId(
    raffleEntry.id
  );
  const raffleEntryProduct = raffleEntryProducts[0];

  const matchingVariant = product?.variants.find(
    (variant) => variant.id === raffleEntryProduct.productVariantId
  );

  invariant(matchingVariant, "matchingVariant not found");

  const mainProductTag = product.tags[0];

  const getProductsResponse = await commerce.getProducts(
    "en",
    undefined,
    undefined,
    `"${mainProductTag}"`
  );

  const matchingAccessories = getProductsResponse.products.filter((product) => {
    return product.tags && product.tags.includes("Accessories");
  });

  const fullMatchingAccessoriesPromises = matchingAccessories.map(
    async (accessory) => await commerce.getProduct("en", accessory.slug)
  );

  const fullMatchingAccessories = await Promise.all(
    fullMatchingAccessoriesPromises
  );

  const formData = await request.formData();

  let serializedFormDataQuantities = serializeFormDataQuantities(formData);

  let serializedFormDataOptionQuantities =
    serializeFormDataOptionQuantities(formData);

  invariant(
    serializedFormDataQuantities,
    "serializedFormDataQuantities not found"
  );

  let selectedAccessories = getSelectedAccessories(
    fullMatchingAccessories,
    serializedFormDataQuantities
  );

  let selectedAccessoriesWithOptions = getSelectedAccessoriesWithOptions(
    fullMatchingAccessories,
    serializedFormDataOptionQuantities
  );

  const checkoutUrl = await commerce.getCheckoutUrl("en", [
    { variantId: matchingVariant.id, quantity: 1 },
    ...selectedAccessories,
    ...selectedAccessoriesWithOptions,
  ]);

  return redirect(checkoutUrl);
};

export default function Confirmation() {
  const { product, matchingAccessories } = useLoaderData() as LoaderData;
  const initialVariant = product.variants.find(
    (variant) => variant.id === product.defaultVariantId
  );
  const initialEstimatedTotalBeforeShipping = initialVariant
    ? parseInt(initialVariant.priceV2.amount)
    : 0;

  const [estimatedTotalBeforeShipping, setEstimatedTotalBeforeShipping] =
    useState<number>(initialEstimatedTotalBeforeShipping);

  const [selectedItems, setSelectedItems] = useState<
    {
      productId: string;
      variantId: string;
      productOption: string;
      quantity: number;
    }[]
  >([]);

  const handleSelectedItemsChange = (
    productId: string,
    variantId: string,
    productOption: string,
    e: React.FormEvent<HTMLSelectElement>
  ) => {
    let newSelectedItems = selectedItems;
    let value = e.currentTarget.value;
    let parsedValue: ParsedFormDataEntryValue = JSON.parse(value);
    let quantity = parseInt(parsedValue.value);

    let index = newSelectedItems.findIndex(
      (item) =>
        item.productId === productId && item.productOption === productOption
    );

    if (index === -1) {
      newSelectedItems.push({
        productId,
        variantId,
        productOption: productOption,
        quantity: quantity,
      });
    } else {
      newSelectedItems[index] = {
        productId,
        variantId,
        productOption: productOption,
        quantity: quantity,
      };
    }

    setSelectedItems(newSelectedItems);
    let newEstimatedTotalBeforeShipping = initialVariant
      ? parseInt(initialVariant.priceV2.amount)
      : 0;
    selectedItems.forEach((item) => {
      let product =
        matchingAccessories &&
        matchingAccessories.find(
          (accessory) => accessory.id === item.productId
        );
      let variant = product?.variants.find(
        (variant) => variant.id === item.variantId
      );
      if (variant) {
        newEstimatedTotalBeforeShipping +=
          parseInt(variant.priceV2.amount) * item.quantity;
      }
    });

    setEstimatedTotalBeforeShipping(newEstimatedTotalBeforeShipping);
  };

  const formattedEstimatedTotalBeforeShipping = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: initialVariant?.priceV2.currencyCode,
  })
    .formatToParts(estimatedTotalBeforeShipping)
    .map((val) => val.value)
    .join("");

  return (
    <Form method="post">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-1 flex-col items-start gap-6">
          <Image src={product.image} />
          <div className="w-full bg-neutral-200 p-6">
            <div className="mb-6 w-full rounded bg-yellow-200 p-6 text-xl">
              Total (before shipping & tax):{" "}
              <b>{formattedEstimatedTotalBeforeShipping}</b>
            </div>
            <Button color="primary" size="large" className="w-full">
              Confirm Entry
            </Button>
          </div>
        </div>
        <div className="mb-6 flex flex-1 flex-col justify-between overflow-hidden">
          <h1 className="mb-6 font-soehneBreit text-xl">{product.title}</h1>
          <p className="mb-6">
            You have been selected to recieve a spot in the {product.title}{" "}
            group buy. Before you checkout, you may want to include some extra
            parts.
          </p>
          {matchingAccessories?.map((matchingAccessory) => {
            const hasOptions = matchingAccessory.options.find(
              (option) => option.values.length > 1
            );

            return (
              <FlexContainer key={matchingAccessory.id}>
                <h3 style={{ marginBottom: 0 }}>{matchingAccessory.title}</h3>

                <div
                  key={matchingAccessory.id}
                  className="mb-6 flex w-full gap-6"
                >
                  <div className="flex-shrink-0 flex-grow-0 basis-24">
                    <Image src={matchingAccessory.image} className="h-20" />
                  </div>
                  <div className="flex-1">
                    {!hasOptions && (
                      <>
                        <Label htmlFor="quantity">Standard</Label>
                        <Select
                          name="quantity"
                          onChange={(e) =>
                            handleSelectedItemsChange(
                              matchingAccessory.id,
                              matchingAccessory.defaultVariantId,
                              "Default",
                              e
                            )
                          }
                        >
                          {[...Array(accessoryCount)].map((_, i) => {
                            const quantityCount = i;
                            return (
                              <option
                                value={JSON.stringify({
                                  name: matchingAccessory.id,
                                  value: quantityCount.toString(),
                                })}
                                key={quantityCount}
                              >
                                {quantityCount}
                              </option>
                            );
                          })}
                        </Select>
                      </>
                    )}

                    {matchingAccessory.options.map((option) => {
                      return hasOptions
                        ? option.values.map((optionValue) => {
                            return (
                              <div key={optionValue}>
                                <Label htmlFor={option.name}>
                                  {optionValue}
                                </Label>

                                <Select
                                  name="optionQuantity"
                                  onChange={(e) =>
                                    handleSelectedItemsChange(
                                      matchingAccessory.id,
                                      matchingAccessory.defaultVariantId,
                                      optionValue,
                                      e
                                    )
                                  }
                                >
                                  {[...Array(accessoryCount)].map((_, i) => {
                                    const quantityCount = i;
                                    return (
                                      <Option
                                        value={JSON.stringify({
                                          name: option.name,
                                          value: quantityCount.toString(),
                                          option: optionValue,
                                          accessoryId: matchingAccessory.id,
                                        })}
                                        key={quantityCount}
                                      >
                                        {quantityCount}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </div>
                            );
                          })
                        : null;
                    })}
                  </div>
                </div>
              </FlexContainer>
            );
          })}
        </div>
      </div>
    </Form>
  );
}
