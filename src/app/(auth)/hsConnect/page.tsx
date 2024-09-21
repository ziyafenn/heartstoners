import { getUser } from "@/service/supabase.service";
import { HsConnectForm } from "./_components/HsConnectForm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

function LinkWrapper({
  link,
  children,
}: { link: string; children: React.ReactNode }) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-baseline gap-1 text-blue-500"
    >
      {children} <ExternalLink className="size-4" />
    </Link>
  );
}

const instructions = [
  {
    description: "Create an HSReplay.net account",
    details: (
      <p>
        If you don't already have one, visit{" "}
        <LinkWrapper link="https://hsreplay.net">HSReplay.net</LinkWrapper> and
        sign up
      </p>
    ),
  },
  {
    description: "Install Hearthstone Deck Tracker (HDT)",
    details: (
      <p>
        <LinkWrapper link="https://hsreplay.net/downloads/">
          Download HDT
        </LinkWrapper>{" "}
        to sync your Hearthstone collection with HSReplay.net
      </p>
    ),
  },
  {
    description: "Upload your collection using HDT",
    details: (
      <p>
        Open Hearthstone while HDT is running to automatically sync your
        collection
      </p>
    ),
  },
  {
    description: "Verify your collection on HSReplay.net",
    details: (
      <p>
        Visit the{" "}
        <LinkWrapper link="https://hsreplay.net/collection/mine/">
          My Collection
        </LinkWrapper>{" "}
        page on HSReplay.net to confirm your collection and dust costs are
        uploaded correctly.
      </p>
    ),
  },
  {
    description: "Make your HSReplay.net collection public",
    details: (
      <p>
        On the "My Collection" page, click <i>"Make my collection public"</i>,
        then copy the provided link and paste it into the field on the page
        above, and press <i>'Connect'</i>
      </p>
    ),
  },
  {
    description: "Troubleshoot connection issues.",
    details: (
      <p>
        If you encounter problems, go to the{" "}
        <LinkWrapper link="https://hsreplay.net/account/">
          My Settings
        </LinkWrapper>{" "}
        page on HSReplay.net and ensure all checkboxes under 'Collection
        uploading' are checked.
      </p>
    ),
  },
];

export default async function HsConnect() {
  const auth = await getUser();
  const { user } = auth;
  if (!user) return redirect("/login");

  return (
    <main className="flex justify-center">
      <div className="flex max-w-3xl flex-col gap-12">
        <section>
          <h1 className="mb-1 font-semibold text-3xl">
            Sync Your Collection to Find Craftable Decks
          </h1>
          <p>
            HeartStoners integrates with HSReplay.net and Hearthstone Deck
            Tracker to sync your Hearthstone collection and dust cost. This
            allows you to discover community-created decks you can craft, see
            which cards you're missing, and calculate how much dust you'll need
            to craft them.
          </p>
        </section>
        <HsConnectForm />

        <section>
          <h2 className="mb-1 font-semibold text-2xl">
            How to connect HSReplay.net account
          </h2>
          <p>
            If you already have an HSReplay.net account and have installed
            Hearthstone Deck Tracker (HDT), skip to step 4.
          </p>
          <ol className="mt-4 ml-4 flex list-decimal flex-col gap-4">
            {instructions.map(({ description, details }) => (
              <li key={description}>
                <h3 className="font-medium text-lg">{description}</h3>
                {details}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
