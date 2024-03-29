import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export default function Input(props: InputProps) {
  const inputClasses = clsx(
    "mb-4 w-full rounded border-2 border-solid border-neutral-500 bg-neutral-100 py-2 px-4 focus:border-primary-300 focus:outline-none",
    props.className
  );
  return <input {...props} className={inputClasses} />;
}

export function InputCheckbox(props: InputProps) {
  return (
    <Input
      className="mt-2 flex h-4 w-4 cursor-pointer appearance-none items-center justify-center checked:before:min-h-full checked:before:min-w-full checked:before:flex-1 checked:before:cursor-pointer checked:before:rounded checked:before:bg-primary-700 checked:before:content-[''] "
      {...props}
    />
  );
}
