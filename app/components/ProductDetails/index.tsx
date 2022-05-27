import { styled } from "~/styles/stitches.config";
import ProductDetail from "~/components/ProductDetail";
import type { ProductMetafield } from "~/models/ecommerce-provider.server";

const ProductDetailsWrapper = styled("div", {
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

export interface ProductDetailsProps {
  metafields: ProductMetafield[];
}

export default function ProductDetails({ metafields }: ProductDetailsProps) {
  const detailsMetafields = metafields?.filter(
    (metafield) => metafield.namespace === "details"
  );

  return (
    <ProductDetailsWrapper>
      {detailsMetafields
        ? detailsMetafields.map((detailsMetafield) => {
            return (
              <ProductDetail
                key={detailsMetafield.key}
                metafield={detailsMetafield}
              />
            );
          })
        : null}
    </ProductDetailsWrapper>
  );
}
