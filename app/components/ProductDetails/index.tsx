import ProductDetail from "~/components/ProductDetail";
import type { ProductMetafield } from "~/models/ecommerce-provider.server";

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
    <div className="grid w-full auto-cols-auto grid-rows-1 rounded border-2 border-solid border-neutral500 bg-neutral200 font-soehneBreit uppercase md:grid-cols-4 ">
      {componentsMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={componentsMetafield.key}
            metafield={componentsMetafield}
          />
        </div>
      ) : null}
      {accessoriesMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={accessoriesMetafield.key}
            metafield={accessoriesMetafield}
          />
        </div>
      ) : null}
      {dimensionsMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={dimensionsMetafield.key}
            metafield={dimensionsMetafield}
          />
        </div>
      ) : null}
      {weightMetafield ? (
        <div className="p-6">
          <ProductDetail
            key={weightMetafield.key}
            metafield={weightMetafield}
          />
        </div>
      ) : null}
    </div>
  );
}
