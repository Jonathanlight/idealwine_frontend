const noteRangesByOrigin = {
  noteRobertParker: { min: 90, max: 100 },
  noteWineSpectator: { min: 90, max: 100 },
  noteBettaneAndDesseauve: { min: 15, max: 20 },
  noteDecanter: { min: 15, max: 20 },
  noteJancisRobinson: { min: 15, max: 20 },
  noteJamesSuckling: { min: 90, max: 100 },
  noteQuarin: { min: 90, max: 100 },
  noteRVF: { min: 90, max: 100 },
  noteLePoint: { min: 15, max: 20 },
  noteVinousAntonioGalloni: { min: 90, max: 100 },
  noteBurghoundBH: { min: 90, max: 100 },
};

export const parseNoteValue = (value: string): number | null => {
  const firstNumber = /\d+/.exec(value)?.[0];

  return firstNumber !== undefined ? parseInt(firstNumber, 10) : null;
};

const isMinimumNoteKey = (note: string): note is keyof typeof noteRangesByOrigin => {
  return note in noteRangesByOrigin;
};

export const isValidNote = (note: [string, unknown]): boolean => {
  const [key, value] = note;

  if (isMinimumNoteKey(key) && typeof value === "string") {
    const noteValueAsInt = parseNoteValue(value);

    return (
      noteValueAsInt !== null &&
      noteValueAsInt >= noteRangesByOrigin[key].min &&
      noteValueAsInt <= noteRangesByOrigin[key].max
    );
  }

  return false;
};
