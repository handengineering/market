export interface DiscordStatusTextFieldsProps {
  children: React.ReactNode;
}

export default function DiscordStatusTextFields({
  children,
}: DiscordStatusTextFieldsProps) {
  return <div className="flex flex-col justify-center">{children}</div>;
}
