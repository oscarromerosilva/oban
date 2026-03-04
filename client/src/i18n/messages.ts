import { es } from "./es";
import { en } from "./en";

export type SupportedLocale = 'es' | 'en';

type Messages = Record<string, string>;

export const messages: Record<SupportedLocale, Messages> = {
  es,
  en
};
