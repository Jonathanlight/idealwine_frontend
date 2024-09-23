const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const KEEP_OLD_TRANSLATIONS = false;

const isObject = item => {
  return item && typeof item === "object" && !Array.isArray(item);
};

const mergeDeep = (target, ...sources) => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

const loadTranslations = lang => {
  const translations = {};
  const files = fs.readdirSync("locales/" + lang);
  files.forEach(file => {
    const filePath = path.join("locales/" + lang, file);
    const contents = fs.readFileSync(filePath, "utf8");
    translations[file] = JSON.parse(contents);
  });

  return translations;
};

const extractExcelData = () => {
  const workbook = XLSX.readFile("scripts/codix-translations.xlsx");
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  data.shift();
  const keepRequiredData = data.map(elem => {
    elem.shift();
    const [key, lang, translation] = elem;

    return [key, lang, translation];
  });

  return keepRequiredData;
};

const codixTranslations = extractExcelData();

let alreadyMet = {};
const codixKeyByFrenchValue = codixTranslations
  .filter(elem => elem[1] === "FR")
  .reduce((acc, currentValue) => {
    if (currentValue[2] in alreadyMet) {
      delete acc[currentValue[2]];

      return acc;
    }
    alreadyMet = { ...alreadyMet, [currentValue[2]]: true };

    return { ...acc, [currentValue[2]]: currentValue[0] };
  }, {});

const codixTranslationByKey = codixTranslations.reduce((acc, currentValue) => {
  if (!acc[currentValue[0]]) {
    return { ...acc, [currentValue[0]]: { [currentValue[1]]: currentValue[2] } };
  }

  return {
    ...acc,
    [currentValue[0]]: { ...acc[currentValue[0]], [currentValue[1]]: currentValue[2] },
  };
}, {});

// function that every leaf of an object if it meet a specific condition
const transformObjectLeafs = (obj, condition, transformation) => {
  const result = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        const nestedTransformed = transformObjectLeafs(obj[key], condition, transformation);
        if (Object.keys(nestedTransformed).length > 0) {
          result[key] = nestedTransformed;
        }
      } else {
        if (condition(obj[key])) {
          result[key] = transformation(obj[key]);
        }
      }
    }
  }

  return result;
};

const frTranslations = loadTranslations("fr");

const codixLocaleCode = {
  en: "AN",
  it: "IT",
  de: "AL",
};

const locales = ["en", "it", "de"];
locales.forEach(locale => {
  const originalTranslations = loadTranslations(locale);

  Object.keys(frTranslations).forEach(key => {
    const frenchTranslations = frTranslations[key];
    const codixLocale = codixLocaleCode[locale];
    const condition = value =>
      value in codixKeyByFrenchValue &&
      codixTranslationByKey[codixKeyByFrenchValue[value]][codixLocale];
    const transformation = value =>
      codixTranslationByKey[codixKeyByFrenchValue[value]][codixLocale];
    const translated = transformObjectLeafs(frenchTranslations, condition, transformation);

    let newTranslations;
    if (KEEP_OLD_TRANSLATIONS) {
      newTranslations = mergeDeep(originalTranslations[key], translated);
    } else {
      newTranslations = translated;
    }

    fs.writeFileSync("locales/" + locale + "/" + key, JSON.stringify(newTranslations), {
      encoding: "utf8",
      flag: "w",
    });
  });
});
