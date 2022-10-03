import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "inverse" | "danger";
  size?: "large" | "small";
}

const classes = {
  base: "cursor-pointer whitespace-nowrap rounded-md bg-neutral-500 py-2 px-4 text-primary-500",
  color: {
    primary: "bg-primary-500 text-primary-100 hover:bg-primary-600",
    secondary: "bg-green-500 text-green-100 hover:bg-green-600",
    tertiary: "bg-yellow-500 text-yellow-900 hover:bg-yellow-600",
    inverse: "bg-neutral-100 text-primary-500 hover:bg-neutral-200",
    danger: "bg-red-500 text-red-100 hover:bg-red-600",
  },
  size: {
    large: "text-2xl py-4 px-2 rounded-md",
    small: "text-sm py-0 px-2 rounded-md",
  },
};

export default function Button({
  children,
  color,
  size,
  className,
  ...rest
}: ButtonProps) {
  const buttonClasses = clsx(
    classes.base,
    color && classes.color[color],
    size && classes.size[size],
    className
  );

  return (
    <button {...rest} className={buttonClasses}>
      {children}
    </button>
  );
}
