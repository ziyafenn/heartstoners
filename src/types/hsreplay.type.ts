import { Enums } from "./superbase.type";

export type UserCollection = {
  dust: number;
  cardbacks: number[];
  favorite_heroes: Record<string, undefined>;
  favorite_cardback: number;
  lastModified: string;
  player_records: {
    [id: string]: {
      [heroId: string]: [win: number, draw: number, losses: number];
    };
  };
  collection: {
    [cardId: string]: [number, number, number, number];
  };
};

type SignatureCore = {
  as_of: string;
  format: number;
  components: number[];
};

type CardClass = Uppercase<Enums<"card_class">>;

export type SubArchetype = {
  id: number;
  name: string;
  player_class: number;
  player_class_name: CardClass;
  standard_ccp_signature_core: SignatureCore;
  url: string;
  wild_ccp_signature_core: SignatureCore | null;
};

export type SubArchetypePopularity = {
  as_of: string;
  render_as: "table";
  series: {
    data: Record<
      CardClass,
      {
        archetype_id: number;
        pct_of_class: number;
        pct_of_total: number;
        total_games: number;
        win_rate: number;
      }[]
    >;
    metadata: Record<CardClass, object>;
  };
};

export type SubArchetypeWinRate = {
  as_of: string;
  render_as: "table";
  series: {
    data: Record<
      CardClass,
      {
        archetype_id: number;
        avg_game_length_seconds: number;
        avg_num_player_turns: number;
        deck_id: string;
        deck_list: number[];
        deck_sideboard: number[];
        digest: string;
        total_games: number;
        win_rate: number;
      }[]
    >;
    metadata: Record<CardClass, object>;
  };
};
