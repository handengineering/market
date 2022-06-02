import clsx from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "inverse" | "danger";
  size?: "large";
}

const classes = {
  base: "cursor-pointer whitespace-nowrap rounded-sm bg-neutral500 py-2 px-4 text-xs text-primary500",
  color: {
    primary: "bg-primary500 text-primary100 hover:bg-primary600",
    secondary: "bg-green500 text-green100 hover:bg-green600",
    tertiary: "bg-yellow500 text-yellow900 hover:bg-yellow600",
    inverse: "bg-neutral100 text-primary500 hover:bg-neutral200",
    danger: "bg-red500 text-red100 hover:bg-red600",
  },
  size: {
    large: "text-lg py-2 px-4 rounded-md",
  },
};

export default function Button({ children, color, size }: ButtonProps) {
  const buttonClasses = clsx(
    classes.base,
    color && classes.color[color],
    size && classes.size[size]
  );

  return <button className={buttonClasses}>{children}</button>;
}
