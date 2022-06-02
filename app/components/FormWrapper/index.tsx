export interface FormWrapperProps {
  children: React.ReactNode;
}

export default function FormWrapper({ children }: FormWrapperProps) {
  return (
    <div className="align-center mb-4 flex flex-col justify-center">
      {children}
    </div>
  );
}
