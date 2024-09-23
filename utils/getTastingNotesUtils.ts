import { ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";

import { parseNoteValue } from "./productVintageNotesUtils";
import { isNotNullNorUndefined } from "./ts-utils";

export type Note = {
  label: string;
  note: number;
};

export enum TastingNoteLabel {
  WA = "WA",
  WS = "WS",
  B_D = "B+D",
  DECANTER = "DECANTER",
  JR = "JR",
  JS = "JS",
  RVF = "RVF",
  LE_POINT = "Le point",
  VINOUS_A = "Vinous A.",
  J_M_Q = "J.-M.Q",
  IDW = "iDw",
  BURGHOUND = "Burghound",
}
export const createTastingNotesObject = (
  results: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead | undefined,
): Note[] => {
  const notes = {
    [TastingNoteLabel.WA]: results?.productVintage?.noteRobertParker ?? null,
    [TastingNoteLabel.WS]: results?.productVintage?.noteWineSpectator ?? null,
    [TastingNoteLabel.B_D]: results?.productVintage?.noteBettaneAndDesseauve ?? null,
    [TastingNoteLabel.DECANTER]: results?.productVintage?.noteDecanter ?? null,
    [TastingNoteLabel.JR]: results?.productVintage?.noteJancisRobinson ?? null,
    [TastingNoteLabel.JS]: results?.productVintage?.noteJamesSuckling ?? null,
    [TastingNoteLabel.RVF]: results?.productVintage?.noteRVF ?? null,
    [TastingNoteLabel.LE_POINT]: results?.productVintage?.noteLePoint ?? null,
    [TastingNoteLabel.VINOUS_A]: results?.productVintage?.noteVinousAntonioGalloni ?? null,
    [TastingNoteLabel.J_M_Q]: results?.productVintage?.noteQuarin ?? null,
    [TastingNoteLabel.IDW]: results?.productVintage?.noteIdealwine ?? null,
    [TastingNoteLabel.BURGHOUND]: results?.productVintage?.noteBurghoundBH ?? null,
  };

  const filteredNotes: Note[] = Object.entries(notes)
    .map(([label, note]) => [label, parseNoteValue(note as string)])
    .filter(([, note]) => isNotNullNorUndefined(note))
    .map(([label, note]) => {
      const noteNumber = note as number;
      const isNoteScaled20 = noteNumber <= 20; // we assume that if the note is under 20, it's a 20 scale note, otherwise it's a 100 scale note
      const scaledNote = isNoteScaled20 ? noteNumber * 5 : noteNumber;

      return {
        label: `${String(label)} ${String(note)}/${isNoteScaled20 ? "20" : "100"}`,
        note: scaledNote,
      };
    });

  return filteredNotes;
};
