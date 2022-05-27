import type { RaffleEntryProduct } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import FlexContainer from "~/components/FlexContainer";
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
  findRaffleEntryProductsByRaffleEntryId,
} from "~/models/raffleEntryProduct.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import { styled } from "~/styles/stitches.config";
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
    (await findRaffleEntryProductsByRaffleEntryId(raffleEntry?.id));

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

  let formData = await request.formData();
  let options = formData.getAll("option");

  const product = matchingProducts && matchingProducts[0];

  let parsedOptions = options.map((option) => {
    if (typeof option !== "string") {
      return null;
    }
    return JSON.parse(option);
  });

  let matchingVariant = product && getMatchingVariant(product, parsedOptions);

  await deleteRaffleEntriesByRaffleIdAndUserId(raffle.id, user.id);

  let raffleEntry = await createRaffleEntry(raffleId, user.id);

  return (
    product &&
    matchingVariant &&
    createRaffleEntryProduct(product.id, matchingVariant.id, raffleEntry.id)
  );
};

const ProductDetailsWrapper = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "$5",
});

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

const ProductDescriptionWrapper = styled("div");

const ProductDescriptionHtml = styled("div", {
  flex: "2",
  maxHeight: "$6",
  textOverflow: "ellipsis",
  overflow: "scroll",
  "& p": {
    fontSize: "inherit",
  },
});

const SelectedVariant = styled("div", {
  flex: "1",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "$neutral100",
  borderRadius: "$3",
  padding: "$3",
  marginBottom: "$5",
});

const SelectedVariantList = styled("ul", {
  display: "flex",
  marginBottom: "0",
  "& li": {
    marginRight: "$5",
  },
});

export let ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <div>{error.message}</div>
);

export default function Configure() {
  const { raffleWithMatchingProducts, selectedVariant } =
    useLoaderData() as LoaderData;
  const product = raffleWithMatchingProducts?.products[0];

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

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

  return product ? (
    <Form method="post">
      <FlexContainer layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <ProductImageWrapper>
          <ProductImage src={product.image} />
        </ProductImageWrapper>
        <ProductDetailsWrapper>
          <ProductDescriptionWrapper>
            <h1>{raffleWithMatchingProducts?.name}</h1>

            <ProductDescriptionHtml
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml || "",
              }}
            />
          </ProductDescriptionWrapper>
          <div>
            {product?.options.map((option) => {
              return (
                <div key={option.name}>
                  <h2>{option.name}</h2>
                  <ProductOptionInputs
                    option={option}
                    product={product}
                    onChange={handleSelectedOptionChange}
                    selectedOptions={selectedOptions}
                  />
                </div>
              );
            })}
          </div>
        </ProductDetailsWrapper>
      </FlexContainer>
      <FlexContainer layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <div style={{ flex: 1 }}>
          <SelectedVariant>
            {Object.keys(selectedOptions).length !== 0 ? (
              <SelectedVariantList>
                {Object.keys(selectedOptions).map((selectedOptionKey) => {
                  return (
                    <li key={selectedOptionKey}>
                      <b>{selectedOptionKey}</b>{" "}
                      {selectedOptions[selectedOptionKey]}
                    </li>
                  );
                })}
              </SelectedVariantList>
            ) : (
              "No options specified"
            )}
          </SelectedVariant>
        </div>

        <div style={{ flex: 1 }}>
          <Button color="primary" size="large">
            Submit Options
          </Button>
        </div>
      </FlexContainer>
      <FlexContainer layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <ProductDetails metafields={product.metafields} />
      </FlexContainer>
    </Form>
  ) : null;
}
