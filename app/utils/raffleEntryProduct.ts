import invariant from "tiny-invariant";
export interface ParsedFormDataEntryName {
  type: string;
  name: string;
  option?: string;
  accessoryId?: string;
}

export interface SerializedFormDataQuantity {
  name: string;
  value: FormDataEntryValue;
}

export interface SerializedFormDataOptionQuantity {
  name: string;
  accessoryId: string;
  value: FormDataEntryValue;
  option: string;
}

export function serializeFormDataQuantities(
  formData: FormData
): SerializedFormDataQuantity[] {
  let formDataEntries = [...formData.entries()];
  return formDataEntries
    .filter((formDataEntry) => {
      let formDataEntryParsedName: ParsedFormDataEntryName | undefined =
        !!formDataEntry[0] && JSON.parse(formDataEntry[0]);
      let type: string | undefined =
        formDataEntryParsedName && formDataEntryParsedName.type;

      return type === "quantity";
    })
    .map((formDataEntry) => {
      let formDataEntryParsedName: ParsedFormDataEntryName | undefined =
        !!formDataEntry[0] && JSON.parse(formDataEntry[0]);

      let name = formDataEntryParsedName && formDataEntryParsedName.name;
      let value: FormDataEntryValue = formDataEntry[1];

      invariant(name, "name is required");

      return (
        formDataEntry && {
          name: name,
          value: value,
        }
      );
    });
}

export function serializeFormDataOptionQuantities(
  formData: FormData
): SerializedFormDataOptionQuantity[] {
  let formDataEntries = [...formData.entries()];

  return formDataEntries
    .filter((formDataEntry) => {
      let formDataEntryParsedName: ParsedFormDataEntryName | undefined =
        !!formDataEntry[0] && JSON.parse(formDataEntry[0]);
      let type = formDataEntryParsedName && formDataEntryParsedName.type;

      return formDataEntry && type === "optionQuantity";
    })
    .map((formDataEntry) => {
      let formDataEntryParsedName: ParsedFormDataEntryName | undefined =
        !!formDataEntry[0] && JSON.parse(formDataEntry[0]);

      console.log({ formDataEntryParsedName });

      let name = formDataEntryParsedName && formDataEntryParsedName.name;
      let value: FormDataEntryValue = formDataEntry[1];
      let accessoryId =
        formDataEntryParsedName && formDataEntryParsedName.accessoryId;
      let option = formDataEntryParsedName && formDataEntryParsedName.option;

      invariant(name, "name is required");
      invariant(value, "quantity is required");
      invariant(accessoryId, "accessoryId is required");
      invariant(option, "option is required");

      return (
        formDataEntry && {
          name: name,
          accessoryId: accessoryId,
          value: value,
          option: option,
        }
      );
    });
}
