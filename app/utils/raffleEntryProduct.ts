export function serializeFormDataQuantities(
  formData: FormData
): { name: string; value: FormDataEntryValue }[] {
  let formDataEntries = [...formData.entries()];
  return formDataEntries
    .filter((formDataEntry) => {
      let type = JSON.parse(formDataEntry[0]).type;

      return formDataEntry && type === "quantity";
    })
    .map((formDataEntry) => {
      let name: string = JSON.parse(formDataEntry[0]).name;
      let value: FormDataEntryValue = formDataEntry[1];

      return (
        formDataEntry && {
          name: name,
          value: value,
        }
      );
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
      let type = JSON.parse(formDataEntry[0]).type;

      return formDataEntry && type === "optionQuantity";
    })
    .map((formDataEntry) => {
      let name: string = JSON.parse(formDataEntry[0]).name;
      let value: string = JSON.parse(formDataEntry[0]).value;
      let quantity: number = parseInt(formDataEntry[1].toString());
      let accessoryId: string = JSON.parse(formDataEntry[0]).accessoryId;
      return (
        formDataEntry && {
          name: name,
          value: value,
          quantity: quantity,
          accessoryId: accessoryId,
        }
      );
    });
}
