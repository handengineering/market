export interface ErrorTextProps {
  children: React.ReactNode;
}

export default function ErrorText({ children }: ErrorTextProps) {
  return <p className="mb-0 text-base text-red500">{children}</p>;
}
