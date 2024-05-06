export default async function Decks() {
  const decks = await getDecks();
  const playerCollection = await getPlayerCollection("sdf");
  const subArchetypes = await getMetaSubArchetypes();

  return <div>decks</div>;
}
