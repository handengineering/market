import { RaffleEntryStatus } from "@prisma/client";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import clsx from "clsx";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { prisma } from "~/db.server";
import { getDiscordProfileByUserId } from "~/models/discordProfile.server";
import type { FullProduct } from "~/models/ecommerce-provider.server";
import { deleteRaffleById, getRaffleById } from "~/models/raffle.server";
import {
  getRaffleEntriesByRaffleId,
  updateRaffleEntryStatusById,
} from "~/models/raffleEntry.server";
import { getRaffleEntryProductsByRaffleEntryId } from "~/models/raffleEntryProduct.server";
import { getUserById } from "~/models/user.server";
import { getUsers } from "~/models/user.server";
import commerce from "~/services/commerce.server";
import { sendConfirmationEmail } from "~/services/email.server";
import { requireAdminPermissions } from "~/services/permissions.server";

type RaffleEntryWithVariants = {
  id: string;
  userId: string;
  status: RaffleEntryStatus;
  email: string;
  discordUsername: string;
  productVariantIds: string[];
};

type LoaderData = {
  createdRaffleEntries?: RaffleEntryWithVariants[];
  drawnRaffleEntries?: RaffleEntryWithVariants[];
  product: FullProduct;
};

function shuffleArray<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export let loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminPermissions(request);

  const raffleId = params.raffleId as string;

  const raffle = await getRaffleById(raffleId);

  invariant(raffle, "raffle not found");

  const raffleEntries = await getRaffleEntriesByRaffleId(raffleId);

  const product = await commerce.getProduct("en", raffle.productSlugs[0]);

  invariant(product, "product not found");

  const users = await getUsers();

  const raffleEntriesWithVariants = await Promise.all(
    raffleEntries.map(async (raffleEntry) => {
      const selectedVariants = await getRaffleEntryProductsByRaffleEntryId(
        raffleEntry.id
      );

      const matchingUser = users.find((user) => user.id === raffleEntry.userId);
      const matchingDiscordProfile = await getDiscordProfileByUserId(
        raffleEntry.userId
      );

      return {
        id: raffleEntry.id,
        email: matchingUser?.email,
        discordUsername: matchingDiscordProfile?.displayName,
        userId: raffleEntry.userId,
        status: raffleEntry.status,
        productVariantIds: selectedVariants.map(
          (variant) => variant.productVariantId
        ),
      };
    })
  );

  const createdRaffleEntries = raffleEntriesWithVariants?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.CREATED
  );

  const drawnRaffleEntries = raffleEntriesWithVariants?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.DRAWN
  );

  return { createdRaffleEntries, drawnRaffleEntries, users, product };
};

export let action: ActionFunction = async ({ request, params }) => {
  const raffleId = params.raffleId as string;

  const raffleEntries = await getRaffleEntriesByRaffleId(raffleId);
  const raffle = await getRaffleById(raffleId);

  const formData = await request.formData();

  const drawnRaffleEntries = raffleEntries?.filter(
    (raffleEntry) => raffleEntry.status === RaffleEntryStatus.DRAWN
  );

  if (formData.get("action") === "draw") {
    const drawCount = formData.get("drawCount");

    const filteredVariantIdsJson = formData.get("filteredVariantIds");

    invariant(filteredVariantIdsJson, "filteredVariantIdsJson not found");

    const filteredVariantIds = JSON.parse(filteredVariantIdsJson.toString());
    const filteringJson = formData.get("filtering");

    const filtering = filteringJson && JSON.parse(filteringJson.toString());
    const users = await getUsers();

    const raffleEntriesWithVariants = await Promise.all(
      raffleEntries.map(async (raffleEntry) => {
        const selectedVariants = await getRaffleEntryProductsByRaffleEntryId(
          raffleEntry.id
        );

        const matchingUser = users.find(
          (user) => user.id === raffleEntry.userId
        );
        const matchingDiscordProfile = await getDiscordProfileByUserId(
          raffleEntry.userId
        );

        return {
          id: raffleEntry.id,
          email: matchingUser?.email,
          discordUsername: matchingDiscordProfile?.displayName,
          userId: raffleEntry.userId,
          status: raffleEntry.status,
          productVariantIds: selectedVariants.map(
            (variant) => variant.productVariantId
          ),
        };
      })
    );

    if (typeof drawCount !== "string") {
      throw "drawCount must be a string";
    }

    const createdRaffleEntries = raffleEntriesWithVariants?.filter(
      (raffleEntry) => raffleEntry.status === RaffleEntryStatus.CREATED
    );

    const filteredRaffleEntries = createdRaffleEntries.filter((raffleEntry) => {
      const isMatching =
        !filtering ||
        (raffleEntry.productVariantIds &&
          filteredVariantIds.some((filteredVariantId: string) =>
            raffleEntry.productVariantIds.includes(filteredVariantId)
          ));
      return isMatching;
    });

    const shuffledRaffleEntries = shuffleArray(filteredRaffleEntries);

    const shuffledCreatedRaffleEntriesToBeDrawn = shuffledRaffleEntries.slice(
      0,
      parseInt(drawCount)
    );

    await prisma.raffleEntry.updateMany({
      where: {
        userId: {
          in: shuffledCreatedRaffleEntriesToBeDrawn.map(
            (raffleEntry) => raffleEntry.userId
          ),
        },
        raffleId: raffleId,
      },
      data: {
        status: RaffleEntryStatus.DRAWN,
      },
    });

    return await prisma.raffleEntry.updateMany({
      where: {
        userId: {
          in: createdRaffleEntries.map((raffleEntry) => raffleEntry.userId),
        },
        raffleId: raffleId,
        status: "CREATED",
      },
      data: {
        status: RaffleEntryStatus.ARCHIVED,
      },
    });
  }

  if (formData.get("action") === "removeAll") {
    return await prisma.raffleEntry.updateMany({
      where: {
        userId: {
          in: drawnRaffleEntries.map((raffleEntry) => raffleEntry.userId),
        },
        raffleId: raffleId,
      },
      data: {
        status: RaffleEntryStatus.CREATED,
      },
    });
  }

  if (formData.get("action") === "restoreArchived") {
    const archivedRaffleEntries = raffleEntries?.filter(
      (raffleEntry) => raffleEntry.status === RaffleEntryStatus.ARCHIVED
    );

    return await prisma.raffleEntry.updateMany({
      where: {
        userId: {
          in: archivedRaffleEntries.map((raffleEntry) => raffleEntry.userId),
        },
        raffleId: raffleId,
      },
      data: {
        status: RaffleEntryStatus.CREATED,
      },
    });
  }

  if (formData.get("action") === "sendConfirmation") {
    for (const entry of drawnRaffleEntries) {
      const user = await getUserById(entry.userId);

      const confirmationLink = `${process.env.BASE_URL}/raffles/${raffleId}/confirmation`;

      user &&
        raffle &&
        (await sendConfirmationEmail(
          user.email,
          raffle.name,
          confirmationLink
        ));
    }
    return redirect("/admin/raffles");
  }

  if (formData.get("action") === "updateRaffleEntry") {
    const raffleEntryId = formData.get("raffleEntryId");
    const status = formData.get("raffleStatus");

    raffleEntryId &&
      status &&
      (await updateRaffleEntryStatusById(
        raffleEntryId.toString(),
        status.toString() as RaffleEntryStatus
      ));
    return redirect(request.url);
  }

  if (formData.get("action") === "deleteRaffle") {
    raffle && deleteRaffleById(raffle.id);
    return redirect("/admin/raffles");
  }
};

export default function Index() {
  const { createdRaffleEntries, drawnRaffleEntries, product } =
    useLoaderData() as LoaderData;
  const [canRemoveAll, setCanRemoveAll] = useState(false);

  const [filteredVariantIds, setFilteredVariantIds] = useState<string[]>([]);
  const [filtering, setFiltering] = useState<boolean>(true);

  const handleVariantFilterButtonPress = (
    e: ChangeEvent<HTMLInputElement>,
    variantId: string
  ) => {
    const newFilteredVariantIds = filteredVariantIds.includes(variantId)
      ? filteredVariantIds.filter((i) => i !== variantId)
      : [...filteredVariantIds, variantId];
    setFilteredVariantIds(newFilteredVariantIds);
  };

  const submitRaffleEntryStatusChange = useSubmit();

  const handleRaffleStatusChange = (e: FormEvent<HTMLFormElement>): void => {
    submitRaffleEntryStatusChange(e.currentTarget);
  };

  return (
    <>
      <h1 className="mb-8 rounded-md bg-primary-500 p-6 font-soehneBreit text-xl text-neutral-100">
        {product.title}
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        <>
          <div className="mb-8">
            <h2 className="mb-8 font-soehneBreit text-lg">
              Created Raffle Entries ({createdRaffleEntries?.length})
            </h2>
            <ul>
              {createdRaffleEntries &&
                createdRaffleEntries
                  .filter((raffleEntry) => {
                    const isMatching =
                      !filtering ||
                      (raffleEntry.productVariantIds &&
                        filteredVariantIds.some((filteredVariantId) =>
                          raffleEntry.productVariantIds.includes(
                            filteredVariantId
                          )
                        ));
                    return isMatching;
                  })
                  .map((raffleEntry) => {
                    return (
                      <li
                        key={raffleEntry.id}
                        className="mb-2 rounded bg-yellow-200 p-2"
                      >
                        {raffleEntry.email}{" "}
                        {raffleEntry.discordUsername &&
                          `(${raffleEntry.discordUsername})`}
                        <Form
                          method="post"
                          onChange={(e) => handleRaffleStatusChange(e)}
                          className="inline"
                        >
                          <input
                            type="hidden"
                            name="action"
                            value="updateRaffleEntry"
                          />
                          <input
                            type="hidden"
                            name="raffleEntryId"
                            value={raffleEntry.id}
                          />
                          <select
                            name="raffleStatus"
                            value={raffleEntry.status}
                          >
                            {Object.values(RaffleEntryStatus).map(
                              (status, index) => {
                                return (
                                  <option key={index} value={status}>
                                    {status}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </Form>
                      </li>
                    );
                  })}
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="mb-8 font-soehneBreit text-lg">Controls</h2>
            <Form method="post">
              <input
                type="hidden"
                name="filteredVariantIds"
                value={JSON.stringify(filteredVariantIds)}
              />
              <input
                type="hidden"
                name="filtering"
                value={JSON.stringify(filtering)}
              />
              <Label>
                Draw Count
                <Input type="number" name="drawCount" />
              </Label>
              <Button
                type="button"
                onClick={() => setFiltering(!filtering)}
                color={filtering ? "secondary" : "primary"}
                className="mb-4"
              >
                Filtering Engage
              </Button>
              <div className="mb-4">
                {product.variants.map((variant, index) => {
                  return (
                    <div key="index">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4"
                        id={variant.id}
                        onChange={(e) =>
                          handleVariantFilterButtonPress(e, variant.id)
                        }
                        checked={filteredVariantIds.includes(variant.id)}
                      />
                      <label htmlFor={variant.id}>
                        {" "}
                        {createdRaffleEntries
                          ?.filter((raffleEntry) =>
                            raffleEntry.productVariantIds.includes(variant.id)
                          )
                          .length.toString()}
                        ◀ {variant.title} ▶{" "}
                        {drawnRaffleEntries
                          ?.filter((raffleEntry) =>
                            raffleEntry.productVariantIds.includes(variant.id)
                          )
                          .length.toString()}
                      </label>
                    </div>
                  );
                })}
              </div>
              <Button
                name="action"
                value="draw"
                color="primary"
                className="mb-2 w-full last:mb-0"
              >
                Draw Participants
              </Button>
              <Button
                name="action"
                value="sendConfirmation"
                color="danger"
                className="mb-2 w-full last:mb-0"
              >
                Send Confirmation and Archive
              </Button>
              <Button
                name="action"
                value="restoreArchived"
                color="secondary"
                className="mb-2 w-full last:mb-0"
              >
                Restore Archived Raffle Entries
              </Button>
              <Button
                size="small"
                name="action"
                value="deleteRaffle"
                color="danger"
                className="mb-2 last:mb-0"
              >
                Delete Raffle
              </Button>{" "}
              {canRemoveAll ? (
                <Button
                  name="action"
                  size="small"
                  value="removeAll"
                  color="danger"
                  className="mb-2 last:mb-0"
                >
                  Confirm Remove All Partipants
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setCanRemoveAll(true);
                  }}
                  className="mb-2 last:mb-0"
                >
                  Remove All Participants
                </Button>
              )}
            </Form>
          </div>
          <div className="mb-8">
            <h2 className="mb-8 font-soehneBreit text-lg">
              Drawn Raffle Entries ({drawnRaffleEntries?.length})
            </h2>

            <ul>
              {drawnRaffleEntries &&
                drawnRaffleEntries.map((raffleEntry) => {
                  return (
                    <li
                      key={raffleEntry.id}
                      className={clsx(
                        "mb-2 rounded bg-green-200 p-2",
                        canRemoveAll && "bg-red-200"
                      )}
                    >
                      {raffleEntry.email}{" "}
                      {raffleEntry.discordUsername &&
                        `(${raffleEntry.discordUsername})`}
                      <Form
                        method="post"
                        onChange={(e) => handleRaffleStatusChange(e)}
                        className="inline"
                      >
                        <input
                          type="hidden"
                          name="action"
                          value="updateRaffleEntry"
                        />
                        <input
                          type="hidden"
                          name="raffleEntryId"
                          value={raffleEntry.id}
                        />
                        <select name="raffleStatus" value={raffleEntry.status}>
                          {Object.values(RaffleEntryStatus).map(
                            (status, index) => {
                              return (
                                <option key={index} value={status}>
                                  {status}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </Form>
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      </div>
    </>
  );
}
