import { Database } from "./supabase";
type Functions = keyof Database["public"]["Functions"];

export type DBFunction<
  T extends Functions,
  O extends "Args" | "Returns",
> = Database["public"]["Functions"][T][O];
