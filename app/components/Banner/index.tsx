import clsx from "clsx";

export interface ErrorTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  linkText: string;
  linkUrl: string;
}

export default function Banner({
  children,
  className,
  linkText,
  linkUrl,
  ...rest
}: ErrorTextProps) {
  return (
    <div
      className={clsx(
        className,
        "w-full rounded-lg bg-primary-500 p-4 text-lg text-neutral-100"
      )}
      {...rest}
    >
      {children}{" "}
      {linkText && linkUrl && (
        <a className="text-yellow-500 underline" href={linkUrl}>
          {linkText}
        </a>
      )}
    </div>
  );
}
