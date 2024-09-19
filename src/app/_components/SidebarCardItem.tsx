import { AssetIcon } from "@/components/AssetIcon";
import { UserAvatar } from "@/components/UserAvatar";
import type { CardClass } from "@/types/hs.type";

type BaseProps = {
  name: string;
};

type HeroProps = BaseProps & {
  slug: CardClass["slug"];
  avatarUrl?: never;
};

type UserProps = BaseProps & {
  slug?: never;
  avatarUrl: string | undefined;
};

type Props = HeroProps | UserProps;

export function SidebarCardItem({ name, slug, avatarUrl }: Props) {
  return (
    <li className="flex items-center gap-2 pt-2">
      {slug ? (
        <AssetIcon type="hero" name={slug} className="size-8" />
      ) : (
        <UserAvatar imageSrc={avatarUrl} />
      )}
      <span>{name}</span>
    </li>
  );
}
