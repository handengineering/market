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
  backgroundColor: "$neutral100",
  borderRadius: "4px",
  padding: "$1",
  height: "$1",
  marginRight: "$1",
  marginBottom: "$1",
  fontSize: "$2",
});

const CloseIcon = styled("span", {
  display: "inline",
  marginLeft: "$1",
  borderRadius: "50%",
  aspectRatio: "1 / 1",
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.5,
  },
});

const MultiSelectWrapper = styled("div", {
  marginBottom: "$3",
});

const PillWrapper = styled("div", {
  display: "flex",
});

const MultiSelectInputWrapper = styled("div", {
  width: "100%",
  position: "relative",
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
  backgroundColor: "$primary500",
  color: "$neutral100",
});

const DropdownList = styled("ul", {
  width: "100%",
  backgroundColor: "$neutral300",
  position: "absolute",
  borderRadius: "4px",
});

const DropdownListItem = styled("li", {
  padding: "$2",
  cursor: "pointer",
  borderLeftWidth: "1px",
  borderRightWidth: "1px",
  borderBottomWidth: "1px",
  borderStyle: "solid",
  borderColor: "$neutral500",
  fontSize: "$2",
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
          <MultiSelectInputWrapper>
            <MultiSelectInput
              name={selectItem.name}
              placeholder="Search"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            <DropdownList {...getMenuProps()}>
              {isOpen &&
                getFilteredItems(items).map((item, index) => (
                  <DropdownListItem
                    style={
                      highlightedIndex === index
                        ? { backgroundColor: "#DAD2E2" }
                        : {}
                    }
                    key={`${item}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    {item}
                  </DropdownListItem>
                ))}
            </DropdownList>
          </MultiSelectInputWrapper>

          <InputButton {...getToggleButtonProps()} aria-label={"toggle menu"}>
            &#8595;
          </InputButton>
        </InputWrapper>
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
