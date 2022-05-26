import { Form, useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from "@remix-run/server-runtime";
import { marked } from "marked";
import { useState } from "react";
import Button from "~/components/Button";
import Card from "~/components/Card";
import FlexContainer from "~/components/FlexContainer";
import Grid from "~/components/Grid";
import Image from "~/components/Image";
import Input from "~/components/Input";
import Label from "~/components/Label";
import type {
  FullProduct,
  ProductMetafield,
} from "~/models/ecommerce-provider.server";
import type { Raffle } from "~/models/raffle.server";
import { getRaffleById } from "~/models/raffle.server";
import type { RaffleEntry } from "~/models/raffleEntry.server";
import { getRaffleEntriesByUserId } from "~/models/raffleEntry.server";
import { createRaffleEntry } from "~/models/raffleEntry.server";
import { authenticator } from "~/services/auth.server";
import commerce from "~/services/commerce.server";
import { styled } from "~/styles/stitches.config";

type RaffleWithMatchingProducts = Raffle & { products: FullProduct[] };

type LoaderData = {
  raffleWithMatchingProducts?: RaffleWithMatchingProducts;
  raffleEntry?: RaffleEntry;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const raffleId = params.raffleId as string;
  const raffle: Raffle | null = await getRaffleById(raffleId);
  const raffleEntries = await getRaffleEntriesByUserId(user.id);

  const raffleEntry = raffleEntries.find(
    (raffleEntry) =>
      raffleEntry.userId === user.id && raffleEntry.raffleId === raffleId
  );

  const matchingProducts =
    raffle &&
    (await Promise.all(
      raffle.productSlugs.map(async (productSlug) => {
        const product = await commerce.getProduct("en", productSlug);
        return product;
      })
    ));

  const raffleWithMatchingProducts = {
    ...raffle,
    products: matchingProducts,
  };

  return { raffleWithMatchingProducts, raffleEntry };
};

export let action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const raffleId = params.raffleId as string;

  return await createRaffleEntry(raffleId, user.id);
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
  // fontSize: "$2",
  "& p": {
    fontSize: "inherit",
  },
});

const ProductDetails = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "$neutral200",
  color: "$neutral700",
  borderRadius: "$3",
  padding: "$5",

  "& p": {
    fontSize: "inherit",
  },
});

const ProductOptionInputs = styled("div", {
  display: "flex",
});

const ProductOptionInput = styled("div", {
  display: "flex",
  alignItems: "flex-start",
});

const ProductOptionImage = styled(Image, {
  flexGrow: "0",
  flexShrink: "0",
  flexBasis: "$3",
  minWidth: "0",
  marginRight: "$5",
  objectFit: "contain",
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

type Option = {
  name: string;
  value: string;
};

type Options = {
  [name: string]: string;
};

export let ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <div>{error}</div>
);

const getWeightUnitShorthand = (weightUnit: string) => {
  switch (weightUnit) {
    case "GRAMS":
      return "g";
    default:
      return weightUnit;
  }
};

const renderDetail = (metafield: ProductMetafield) => {
  switch (metafield.type) {
    case "list.dimension":
      const dimensionsArray = JSON.parse(metafield.value);
      return (
        <div>
          <h3>{metafield.key}</h3>
          <p>
            {dimensionsArray.map(
              (dimension: { value: string; unit: string }, i: number) =>
                `${dimension.value} ${dimension.unit}${
                  i !== dimensionsArray.length - 1 ? " x " : ""
                }`
            )}
          </p>
        </div>
      );
    case "weight":
      const weight = JSON.parse(metafield.value);

      return (
        <div>
          <h3>{metafield.key}</h3>
          <p>{`${weight.value} ${getWeightUnitShorthand(weight.unit)}`}</p>
        </div>
      );
    default:
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: marked.parse(metafield.value),
          }}
        />
      );
  }
};

export default function Configure() {
  const { raffleWithMatchingProducts } = useLoaderData() as LoaderData;
  const product = raffleWithMatchingProducts?.products[0];
  const [selectedOptions, setSelectedOptions] = useState<Options>({});

  const handleSelectedOptionChange = (option: Option) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [option.name]: option.value,
    };

    setSelectedOptions(newSelectedOptions);
  };

  const detailsMetafields = product?.metafields?.filter(
    (metafield) => metafield.namespace === "details"
  );

  return (
    <Form method="post">
      <FlexContainer layout={{ "@initial": "mobile", "@bp2": "desktop" }}>
        <ProductImageWrapper>
          <ProductImage src={product?.image} />
        </ProductImageWrapper>
        <ProductDetailsWrapper>
          <ProductDescriptionWrapper>
            <h1>{raffleWithMatchingProducts?.name}</h1>

            <ProductDescriptionHtml
              dangerouslySetInnerHTML={{
                __html: product?.descriptionHtml || "",
              }}
            />
          </ProductDescriptionWrapper>
          <div>
            {" "}
            {product?.options.map((option) => {
              return (
                <>
                  <h2>{option.name}</h2>
                  <ProductOptionInputs>
                    {option.values.map((value) => {
                      const matchingVariant = product?.variants.find(
                        (variant) => {
                          return variant.selectedOptions.find(
                            (selectedOption) => {
                              return (
                                selectedOption.name === option.name &&
                                selectedOption.value === value
                              );
                            }
                          );
                        }
                      );

                      const variantIcon = matchingVariant?.icon;
                      const variantIconImageSrc =
                        variantIcon && variantIcon.reference.image.originalSrc;

                      return (
                        <ProductOptionInput key={value}>
                          {variantIconImageSrc ? (
                            <ProductOptionImage src={variantIconImageSrc} />
                          ) : null}
                          <Label>
                            {value}
                            <Input
                              type="radio"
                              name={option.name}
                              value={value}
                              onChange={() =>
                                handleSelectedOptionChange({
                                  name: option.name,
                                  value,
                                })
                              }
                              css={{ marginBottom: 0 }}
                            />
                          </Label>
                        </ProductOptionInput>
                      );
                    })}
                  </ProductOptionInputs>
                </>
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
        <ProductDetails>
          {detailsMetafields
            ? detailsMetafields.map((detailsMetafield) => {
                return renderDetail(detailsMetafield);
              })
            : null}
        </ProductDetails>
      </FlexContainer>
    </Form>
  );
}
