import clsx from "clsx";

const classes = {
  base: "flex flex-col p-4 rounded-sm bg-neutral300",
};

export interface CardProps {
  children: React.ReactNode;
}
export default function Card({ children }: CardProps) {
  const cardClasses = clsx(classes.base);

  return <div className={cardClasses}>{children}</div>;
}
