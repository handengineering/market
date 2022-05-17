import { useCombobox, useMultipleSelection } from "downshift";
import { useState } from "react";
import { styled } from "~/styles/stitches.config";
import Input from "../Input";

type Item = string | null;
type Items = Item[];

export interface MultiSelectProps {
  items: Items;
  name: string;
}

const Pill = styled("div", {
  display: "flex",
  alignItems: "center",
  background: "$pmsBrightWhite",
  borderRadius: "4px",
  padding: "$1",
  height: "$1",
  marginRight: "$1",
  marginBottom: "$1",
});

const CloseIcon = styled("span", {
  display: "inline",
  marginLeft: "$1",
  borderRadius: "50%",
  aspectRatio: "1 / 1",
  textAlign: "center",
  cursor: "pointer",
});

const MultiSelectWrapper = styled("div", {
  position: "relative",
  marginBottom: "$3",
});

const PillWrapper = styled("div", {
  display: "flex",
});

const MultiSelectInput = styled(Input, {
  margin: "0",
});

const InputWrapper = styled("div", {
  display: "flex",
  alignItems: "flex-start",
});

const InputButton = styled("div", {
  display: "flex",
  flexGrow: "0",
  flexBasis: "$1",
  flexShrink: "0",
  marginLeft: "$1",
  alignItems: "center",
  justifyContent: "center",
  width: "$1",
  height: "$1",
  borderRadius: "50%",
  background: "$reflexBlue",
  color: "white",
});

const DropdownList = styled("ul", {
  background: "$pmsBrightWhite",
  position: "absolute",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "$reflexBlue",
  borderRadius: "4px",
  width: "100%",
});

const DropdownListItem = styled("li", {
  padding: "$1",
  cursor: "pointer",
});

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
    inputValue,
    items: getFilteredItems(items),
    onStateChange: ({ inputValue, type, selectedItem }) => {
      console.log(isOpen, selectedItems);

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
    <MultiSelectWrapper>
      <div>
        <PillWrapper>
          {selectedItems.map((selectedItem, index) => (
            <Pill
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem}
              <CloseIcon onClick={() => removeSelectedItem(selectedItem)}>
                &#10005;
              </CloseIcon>
            </Pill>
          ))}
        </PillWrapper>
        <InputWrapper {...getComboboxProps()}>
          <MultiSelectInput
            name={selectItem.name}
            placeholder="Search"
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
          <InputButton {...getToggleButtonProps()} aria-label={"toggle menu"}>
            &#8595;
          </InputButton>
        </InputWrapper>
        {isOpen && (
          <DropdownList {...getMenuProps()}>
            {getFilteredItems(items).map((item, index) => (
              <DropdownListItem
                style={
                  highlightedIndex === index
                    ? { backgroundColor: "#bde4ff" }
                    : {}
                }
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </DropdownListItem>
            ))}
          </DropdownList>
        )}
      </div>

      {selectedItems.map((selectedItem) => {
        const value: string =
          typeof selectedItem === "string" ? selectedItem : "";
        return <input key={value} hidden name={name} value={value} />;
      })}
    </MultiSelectWrapper>
  );
};

export default MultiSelect;
