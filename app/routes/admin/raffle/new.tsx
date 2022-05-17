import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Input from "~/components/Input";
import type { Raffle } from "~/models/raffle.server";
import { createRaffle } from "~/models/raffle.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import commerce from "~/services/commerce.server";
import FormWrapper from "~/components/FormWrapper";
import type { Product } from "~/models/ecommerce-provider.server";
import MultiSelect from "~/components/MultiSelect";

export default function Index() {
  const { products } = useLoaderData<LoaderData>();
  const actionResponse = useActionData<ActionData>();

  console.log(actionResponse);
  return (
    <FormWrapper>
      <Form method="post" action="/admin/raffle/new">
        <h2>Create New Raffle</h2>
        <Input name="name" placeholder="Name" aria-label="Name" type="text" />

        <MultiSelect
          name="product"
          items={products.map((product) => product.slug)}
        />
        {actionResponse && actionResponse.raffle ? (
          <Button type="submit" disabled>
            Create New Raffle
          </Button>
        ) : (
          <Button type="submit" color="primary">
            Create New Raffle
          </Button>
        )}
      </Form>
    </FormWrapper>
  );
}

interface ActionData {
  errors: {
    name?: string;
  };
  raffle?: Raffle;
}

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const productSlugs = formData.getAll("product");

  if (typeof name !== "string") {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (productSlugs.length === 0) {
    return json<ActionData>(
      { errors: { name: "Product slugs are required" } },
      { status: 400 }
    );
  }

  const raffle = await createRaffle(
    name,
    productSlugs.map((productSlug) => productSlug.toString())
  );

  return { raffle };
};

type LoaderData = {
  hasNextPage: boolean;
  products: Product[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const productsResponse = await commerce.getProducts(
    "en",
    undefined,
    undefined,
    undefined,
    undefined,
    100,
    undefined
  );

  const { hasNextPage, products } = productsResponse;

  return { hasNextPage, products };
};
