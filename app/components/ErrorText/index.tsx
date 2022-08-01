export interface ErrorTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export default function ErrorText({ children, ...rest }: ErrorTextProps) {
  return (
    <p className="mb-0 text-base text-red-500" {...rest}>
      {children}
    </p>
  );
}
