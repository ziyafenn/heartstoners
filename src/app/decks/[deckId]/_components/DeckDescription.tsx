type Props = {
  description: string | null;
  youtube_id: string | null;
};
export function DeckDescription({ description, youtube_id }: Props) {
  return (
    <div className="flex flex-col gap-4 pr-4">
      <div className="whitespace-pre-wrap">{description}</div>
      {!!youtube_id && (
        <iframe
          id="ytplayer"
          width="640"
          height="360"
          src={`https://www.youtube.com/embed/${youtube_id}`}
          title="youtube"
        />
      )}
    </div>
  );
}
