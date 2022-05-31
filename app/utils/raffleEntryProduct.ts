export function serializeFormDataQuantities(
  formData: FormData
): { name: string; value: FormDataEntryValue }[] {
  let formDataEntries = [...formData.entries()];
  return formDataEntries
    .filter((formDataEntry) => {
      return JSON.parse(formDataEntry[0]).type === "quantity";
    })
    .map((formDataEntry) => {
      return {
        name: JSON.parse(formDataEntry[0]).name,
        value: formDataEntry[1],
      };
    });
}

export function serializeFormDataOptionQuantities(formData: FormData): {
  name: string;
  value: string;
  quantity: number;
  accessoryId: string;
}[] {
  let formDataEntries = [...formData.entries()];

  return formDataEntries
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
}
