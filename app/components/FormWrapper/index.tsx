export interface FormWrapperProps {
  children: React.ReactNode;
}

export default function FormWrapper({ children }: FormWrapperProps) {
  return (
    <div className="align-center mb-4 flex w-full flex-col justify-center md:max-w-sm">
      {children}
    </div>
  );
}
