import { useCombobox, useMultipleSelection } from "downshift";
import { useState } from "react";
import Input from "../Input";

type Item = string | null;
type Items = Item[];

export interface MultiSelectProps {
  items: Items;
  name: string;
}

const MultiSelect = ({ items, name }: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState("");
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({});
  const getFilteredItems = (items: Items) =>
    items.filter(
      (item) =>
        selectedItems.indexOf(item) < 0 &&
        item &&
        item.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    id: "multi-select",
    inputValue,
    items: getFilteredItems(items),
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          inputValue && setInputValue(inputValue);

          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue("");
            addSelectedItem(selectedItem);
            selectItem(null);
          }

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="mb-4">
      <div>
        <div className="flex">
          {selectedItems.map((selectedItem, index) => (
            <div
              key={`selected-item-${index}`}
              className="mr-4 mb-4 flex items-center rounded bg-neutral-100 p-2"
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem}
              <span
                onClick={() => removeSelectedItem(selectedItem)}
                className="ml-2 inline aspect-square rounded-full text-center hover:cursor-pointer hover:opacity-50"
              >
                &#10005;
              </span>
            </div>
          ))}
        </div>

        <div {...getComboboxProps()} className="flex items-center">
          <div className="relative w-full">
            <Input
              name={selectItem.name}
              placeholder="Search"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              className="mb-0"
            />

            <ul
              {...getMenuProps()}
              className="absolute w-full rounded bg-neutral-300"
            >
              {isOpen &&
                getFilteredItems(items).map((item, index) => (
                  <li
                    style={
                      highlightedIndex === index
                        ? { backgroundColor: "#DAD2E2" }
                        : {}
                    }
                    key={`${item}${index}`}
                    {...getItemProps({ item, index })}
                    className="cursor-pointer border-l-2 border-r-2 border-b-2 border-solid border-neutral-500 p-4 text-sm"
                  >
                    {item}
                  </li>
                ))}
            </ul>
          </div>

          <div
            {...getToggleButtonProps()}
            className="ml-4 flex h-6 w-6 flex-shrink-0 flex-grow-0 basis-6 items-center justify-center rounded-full bg-primary-500 text-neutral-100 hover:cursor-pointer hover:opacity-50"
            aria-label={"toggle menu"}
          >
            &#8595;
          </div>
        </div>
      </div>

      {selectedItems.map((selectedItem) => {
        const value: string =
          typeof selectedItem === "string" ? selectedItem : "";
        return <input key={value} hidden name={name} value={value} />;
      })}
    </div>
  );
};

export default MultiSelect;
