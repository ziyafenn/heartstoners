type Props = {
  name: string;
  image?: string;
};
export function SidebarCardItem({ name }: Props) {
  return (
    <li className="flex items-center gap-2 pt-2">
      <div className="size-8 rounded-full bg-red-500" />
      <span>{name}</span>
    </li>
  );
}
