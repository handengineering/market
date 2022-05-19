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
import Textarea from "~/components/Textarea";
import Label from "~/components/Label";

export default function Index() {
  const { products } = useLoaderData<LoaderData>();
  const actionResponse = useActionData<ActionData>();

  return (
    <FormWrapper>
      <Form method="post" action="/admin/raffle/new">
        <h2>Create New Raffle</h2>
        <Label>
          Name
          <Input name="name" aria-label="Name" type="text" />
        </Label>
        <Label>
          Description
          <Textarea name="description" aria-label="Description" />
        </Label>
        <Label>
          Start Date
          <Input name="startDateTime" aria-label="Start Date" type="date" />
        </Label>
        <Label>
          End Date
          <Input name="endDateTime" aria-label="End Date" type="date" />
        </Label>
        <Label>
          Product SKUs
          <MultiSelect
            name="product"
            items={products.map((product) => product.slug)}
          />
        </Label>
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
  const description = formData.get("description");
  const startDateTime = formData.get("startDateTime");
  const endDateTime = formData.get("endDateTime");
  const productSlugs = formData.getAll("product");

  if (typeof name !== "string") {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string") {
    return json<ActionData>(
      { errors: { name: "Description is required" } },
      { status: 400 }
    );
  }

  if (typeof startDateTime !== "string") {
    return json<ActionData>(
      { errors: { name: "StartDateTime is required" } },
      { status: 400 }
    );
  }

  if (typeof endDateTime !== "string") {
    return json<ActionData>(
      { errors: { name: "EndDateTime is required" } },
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
    description,
    productSlugs.map((productSlug) => productSlug.toString()),
    new Date(startDateTime).toISOString(),
    new Date(endDateTime).toISOString()
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
