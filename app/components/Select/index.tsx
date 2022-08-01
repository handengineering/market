export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export interface OptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export default function Select({ children, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      className="border-neutral-500 mb-4 ml-0 mr-0 grid w-full appearance-none items-center rounded border-2 border-solid border-neutral-500 p-2 text-sm focus:border-primary-300 focus:outline-none"
    >
      {children}
    </select>
  );
}

export function Option(props: OptionProps) {
  return <option {...props} className="border-none" />;
}
