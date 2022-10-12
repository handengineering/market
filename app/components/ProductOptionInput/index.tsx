import type { SelectedProductOption } from "~/models/ecommerce-provider.server";

export interface ProductOptionInputProps {
  name: string;
  value: string;
  onChange: (option: SelectedProductOption) => void;
  checked: boolean;
  iconImageSrc?: string;
}

export default function ProductOptionInput({
  name,
  value,
  onChange,
  checked,
  iconImageSrc,
  ...rest
}: ProductOptionInputProps) {
  return (
    <div key={value} className="flex items-start">
      <input
        type="radio"
        name={JSON.stringify({
          type: "option",
          name: name,
        })}
        style={{ backgroundImage: `url(${iconImageSrc})` }}
        className="before: flex h-12 w-12 appearance-none items-center justify-center rounded border-2 border-solid border-neutral-500 bg-cover before:border-2 before:border-neutral-100 before:border-neutral-100  before:content-none checked:border-neutral-900 checked:before:h-full checked:before:w-full checked:before:flex-1 before:checked:border-solid checked:before:content-[''] hover:cursor-pointer"
        value={value}
        alt={value}
        checked={checked}
        onChange={() =>
          onChange({
            name: name,
            value: value,
          })
        }
      />
    </div>
  );
}
