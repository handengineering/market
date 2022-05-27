import type {
  FullProduct,
  ProductVariant,
  SelectedProductOption,
} from "~/models/ecommerce-provider.server";
import { getMatchingVariant } from "./product";

const expectedVariant: ProductVariant = {
  id: "variant-2",
  title: "Silver Standard Test Product",
  icon: {
    id: "icon-2",
    reference: {
      image: {
        originalSrc: "image-src",
      },
    },
  },
  selectedOptions: [
    { name: "Color", value: "Silverstone Metallic" },
    { name: "Type", value: "Standard" },
  ],
};

const selectedProductOptions: SelectedProductOption[] = [
  {
    name: "Color",
    value: "Silverstone Metallic",
  },
  {
    name: "Type",
    value: "Standard",
  },
];

const product: FullProduct = {
  id: "test-id",
  slug: "test-id",
  defaultVariantId: "variant-1",
  formattedPrice: "$100",
  image: "image-src",
  title: "Test Product",
  images: [],
  availableForSale: true,
  options: [
    { name: "Color", values: ["New Formula Red", "Silverstone Metallic"] },
    { name: "Type", values: ["Standard", "Deluxe"] },
  ],
  variants: [
    {
      id: "variant-1",
      title: "Red Deluxe Test Product",
      icon: {
        id: "icon-1",
        reference: {
          image: {
            originalSrc: "image-src",
          },
        },
      },
      selectedOptions: [
        { name: "Color", value: "New Formula Red" },
        { name: "Type", value: "Deluxe" },
      ],
    },
    { ...expectedVariant },
  ],
  metafields: [],
};

test("getMatchingVariant returns a matching variant", () => {
  expect(getMatchingVariant(selectedProductOptions, product)).toEqual(
    expectedVariant
  );
});
