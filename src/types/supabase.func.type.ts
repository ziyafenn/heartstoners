import { Database } from "./superbase.type";
type Functions = keyof Database["public"]["Functions"];

export type DBFunction<
  T extends Functions,
  O extends "Args" | "Returns",
> = Database["public"]["Functions"][T][O];
