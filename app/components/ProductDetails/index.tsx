import { styled } from "~/styles/stitches.config";
import ProductDetail from "~/components/ProductDetail";
import type { ProductMetafield } from "~/models/ecommerce-provider.server";

const ProductDetailsWrapper = styled("div", {
  width: "100%",
  display: "grid",
  gridAutoColumns: "auto",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gridTemplateRows: "1fr",

  backgroundColor: "$neutral200",
  borderRadius: "$3",
  borderWidth: "$1",
  borderStyle: "solid",
  borderColor: "$neutral500",

  "& p": {
    fontSize: "inherit",
  },
});

const ProductDetailWrapper = styled("div", {
  padding: "$5",
  "& ul": {
    margin: "0",
  },
});

export interface ProductDetailsProps {
  metafields: ProductMetafield[];
}

export default function ProductDetails({ metafields }: ProductDetailsProps) {
  const detailsMetafields = metafields?.filter(
    (metafield) => metafield.namespace === "details"
  );

  const componentsMetafield = detailsMetafields.find(
    (metafield) => metafield.key === "components"
  );
  const accessoriesMetafield = detailsMetafields.find(
    (metafield) => metafield.key === "accessories"
  );
  const dimensionsMetafield = detailsMetafields.find(
    (metafield) => metafield.type === "list.dimension"
  );
  const weightMetafield = detailsMetafields.find(
    (metafield) => metafield.type === "weight"
  );

  return (
    <ProductDetailsWrapper>
      {componentsMetafield ? (
        <ProductDetailWrapper>
          <ProductDetail
            key={componentsMetafield.key}
            metafield={componentsMetafield}
          />
        </ProductDetailWrapper>
      ) : null}
      {accessoriesMetafield ? (
        <ProductDetailWrapper>
          <ProductDetail
            key={accessoriesMetafield.key}
            metafield={accessoriesMetafield}
          />
        </ProductDetailWrapper>
      ) : null}
      {dimensionsMetafield ? (
        <ProductDetailWrapper>
          <ProductDetail
            key={dimensionsMetafield.key}
            metafield={dimensionsMetafield}
          />
        </ProductDetailWrapper>
      ) : null}
      {weightMetafield ? (
        <ProductDetailWrapper>
          <ProductDetail
            key={weightMetafield.key}
            metafield={weightMetafield}
          />
        </ProductDetailWrapper>
      ) : null}
    </ProductDetailsWrapper>
  );
}
