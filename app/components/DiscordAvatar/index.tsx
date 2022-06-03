export interface DiscordAvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function DiscordAvatar(props: DiscordAvatarProps) {
  return (
    <img
      className="my-4 mr-4 h-12 w-12 self-center rounded-full border-2 border-solid border-neutral-500"
      alt={props.alt}
      {...props}
    />
  );
}
