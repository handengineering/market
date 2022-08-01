import invariant from "tiny-invariant";
export interface ParsedFormDataEntryValue {
  name: string;
  value: string;
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
  value: string;
  option: string;
}

export function serializeFormDataQuantities(
  formData: FormData
): SerializedFormDataQuantity[] {
  let formDataEntries = [...formData.entries()];
  return formDataEntries
    .filter((formDataEntry) => {
      return formDataEntry && formDataEntry[0] === "quantity";
    })
    .map((formDataEntry) => {
      let formDataEntryParsedValue: ParsedFormDataEntryValue | undefined =
        !!formDataEntry[1] && JSON.parse(formDataEntry[1].toString());

      let name = formDataEntryParsedValue?.name;
      let value = formDataEntryParsedValue?.value;

      invariant(name, "name is required");
      invariant(value, "value is required");

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
      return formDataEntry && formDataEntry[0] === "optionQuantity";
    })
    .map((formDataEntry) => {
      let formDataEntryParsedValue: ParsedFormDataEntryValue | undefined =
        !!formDataEntry[1] && JSON.parse(formDataEntry[1].toString());

      let name = formDataEntryParsedValue?.name;
      let value = formDataEntryParsedValue?.value || "0";
      let accessoryId = formDataEntryParsedValue?.accessoryId;
      let option = formDataEntryParsedValue?.option;

      invariant(name, "name is required");
      invariant(value, "value is required");
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
