export interface DiscordStatusWrapperProps {
  children: React.ReactNode;
}

export default function DiscordStatusWrapper({
  children,
}: DiscordStatusWrapperProps) {
  <div className="mb-4 flex flex-row">{children}</div>;
}
