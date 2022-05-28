import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import FlexContainer from "~/components/FlexContainer";
import Image from "~/components/Image";
import Label from "~/components/Label";
import Select from "~/components/Select";
import type {
  FullProduct,
  SelectedProductOption,
} from "~/models/ecommerce-provider.server";
import { getRaffleById } from "~/models/raffle.server";
import { getRaffleEntriesByRaffleIdAndUserId } from "~/models/raffleEntry.server";
import { getRaffleEntryProductsByRaffleEntryId } from "~/models/raffleEntryProduct.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import { styled } from "~/styles/stitches.config";
import { getMatchingVariant } from "~/utils/product";

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
  let formDataEntries = [...formData.entries()];
  let serializedFormDataQuantities = formDataEntries
    .filter((formDataEntry) => {
      return JSON.parse(formDataEntry[0]).type === "quantity";
    })
    .map((formDataEntry) => {
      return {
        name: JSON.parse(formDataEntry[0]).name,
        value: formDataEntry[1],
      };
    });

  let serializedFormDataOptionQuantities: {
    name: string;
    value: string;
    quantity: number;
    accessoryId: string;
  }[] = formDataEntries
    .filter((formDataEntry) => {
      return JSON.parse(formDataEntry[0]).type === "optionQuantity";
    })
    .map((formDataEntry) => {
      return {
        name: JSON.parse(formDataEntry[0]).name,
        value: JSON.parse(formDataEntry[0]).value,
        quantity: parseInt(formDataEntry[1].toString()),
        accessoryId: JSON.parse(formDataEntry[0]).accessoryId,
      };
    });

  invariant(
    serializedFormDataQuantities,
    "serializedFormDataQuantities not found"
  );

  let selectedAccessories: { variantId: string; quantity: number }[] =
    fullMatchingAccessories.map((matchingAccessory) => {
      invariant(matchingAccessory, "matchingAccessory not found");
      const matchingQuantity = serializedFormDataQuantities.find(
        (quantity) => quantity.name === matchingAccessory.id
      );

      return {
        variantId: matchingAccessory.defaultVariantId,
        quantity: matchingQuantity
          ? parseInt(matchingQuantity.value.toString())
          : 0,
      };
    });

  let selectedAccessoriesWithOptions: {
    variantId: string;
    quantity: number;
  }[] = fullMatchingAccessories.flatMap((matchingAccessory) => {
    invariant(matchingAccessory, "matchingAccessory not found");

    const matchingOptions = serializedFormDataOptionQuantities.filter(
      (optionQuantity) => optionQuantity.accessoryId === matchingAccessory.id
    );

    return matchingOptions.map((option) => {
      const matchingQuantity = serializedFormDataOptionQuantities.find(
        (quantity) => quantity.value === option.value
      );

      let matchingVariant = getMatchingVariant(
        [{ name: option.name, value: option.value }],
        matchingAccessory
      );

      return {
        quantity: matchingQuantity ? matchingQuantity.quantity : 0,
        variantId: matchingVariant
          ? matchingVariant.id
          : matchingAccessory.defaultVariantId,
      };
    });
  });

  const checkoutUrl = await commerce.getCheckoutUrl("en", [
    { variantId: matchingVariant.id, quantity: 1 },
    ...selectedAccessories,
    ...selectedAccessoriesWithOptions,
  ]);

  return redirect(checkoutUrl);
};

const ProductImageWrapper = styled("div", {
  flex: "1",
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  gap: "$5",
  marginBottom: "$5",
});

const ProductImage = styled(Image, {
  height: "$9",
  width: "100%",
});

const ProductConfirmationWrapper = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "$5",
});

const MatchingAccessoryWrapper = styled("div", {
  display: "flex",
  gap: "$5",
  marginBottom: "$5",
});

const MatchingAccessoryImage = styled(Image, {});

const MatchingAccessoryImageWrapper = styled("div", {
  flexGrow: "0",
  flexShrink: "0",
  flexBasis: "$5",
});

const MatchingAccessoryOptionsWrapper = styled("div", { flex: "1" });

export default function Confirmation() {
  const { product, matchingAccessories } = useLoaderData() as LoaderData;

  return (
    <Form method="post">
      <FlexContainer layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <ProductImageWrapper>
          <ProductImage src={product.image} />
        </ProductImageWrapper>
        <ProductConfirmationWrapper>
          <h2>Congratulations</h2>
          <p>
            You have been selected to recieve a spot in the {product.title}{" "}
            group buy. Before you checkout, you may want to include some extra
            parts.
          </p>
          {matchingAccessories?.map((matchingAccessory) => {
            const hasOptions = matchingAccessory.options.find(
              (option) => option.values.length > 1
            );

            return (
              <FlexContainer
                key={matchingAccessory.id}
                css={{ flexDirection: "column" }}
              >
                <h3>{matchingAccessory.title}</h3>

                <MatchingAccessoryWrapper key={matchingAccessory.id}>
                  <MatchingAccessoryImageWrapper>
                    <MatchingAccessoryImage src={matchingAccessory.image} />
                  </MatchingAccessoryImageWrapper>
                  <MatchingAccessoryOptionsWrapper>
                    <h4>Quantity</h4>

                    {!hasOptions && (
                      <Select
                        name={JSON.stringify({
                          type: "quantity",
                          name: matchingAccessory.id,
                        })}
                      >
                        {[...Array(accessoryCount)].map((_, i) => {
                          const value = i;
                          return (
                            <option value={value} key={value}>
                              {value}
                            </option>
                          );
                        })}
                      </Select>
                    )}

                    {hasOptions ? <h4>Options</h4> : null}

                    {matchingAccessory.options.map((option) => {
                      return hasOptions
                        ? option.values.map((value) => {
                            return (
                              <Label key={value}>
                                {value}
                                <Select
                                  name={JSON.stringify({
                                    type: "optionQuantity",
                                    name: option.name,
                                    value: value,
                                    accessoryId: matchingAccessory.id,
                                  })}
                                >
                                  {[...Array(accessoryCount)].map((_, i) => {
                                    const value = i;
                                    return (
                                      <option value={value} key={value}>
                                        {value}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </Label>
                            );
                          })
                        : null;
                    })}
                  </MatchingAccessoryOptionsWrapper>
                </MatchingAccessoryWrapper>
              </FlexContainer>
            );
          })}
          <Button color="primary">Confirm Entry</Button>
        </ProductConfirmationWrapper>
      </FlexContainer>
    </Form>
  );
}
