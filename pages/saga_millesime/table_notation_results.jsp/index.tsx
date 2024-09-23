import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { LOCALES } from "@/urls/linksTranslation";
import {
  DecoratedGetServerSideProps,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";
import { isNonEmptyString, isValueInArray } from "@/utils/ts-utils";

const Page = () => <></>;

interface StringObject {
  [index: string]: string;
}

const countryMapping: StringObject = {
  Australie: "AUSTRALIE",
  Espagne: "ESPAGNE",
  Italie: "ITALIE",
  Portugal: "PORTUGAL",
  "USA Californie": "CALIFORNIE",
};

const regionMapping: StringObject = {
  Alsace: "ALSACE",
  Beaujolais: "BEAUJOLAIS",
  Bordeaux: "BORDEAUX",
  Bourgogne: "BOURGOGNE",
  Champagne: "CHAMPAGNE",
  "Jura/Savoie": "JURA",
  Languedoc: "LANGUEDOC",
  Provence: "PROVENCE",
  Roussillon: "ROUSSILLON",
  "Sud-Ouest": "SUD_OUEST",
  "Vallee-de-la-Loire": "VALLEE_DE_LA_LOIRE",
  "Vallee-du-Rhone-Nord": "VALLEE_DU_RHONE",
  "Vallee-du-Rhone-Sud": "VALLEE_DU_RHONE",
};

// eslint-disable-next-line @typescript-eslint/require-await
const getServerSidePageProps: DecoratedGetServerSideProps = async ({ query, locale }) => {
  const lang = isValueInArray(locale, LOCALES) ? locale : "fr";

  const { millesime, region, pays: country } = query;

  if (isNonEmptyString(millesime) && isNonEmptyString(region)) {
    const newUrl = getPlpUrl({ vintage: [millesime], region: [regionMapping[region]] }, lang);

    return {
      redirect: {
        destination: newUrl,
        statusCode: 301,
      },
    };
  } else if (isNonEmptyString(millesime) && isNonEmptyString(country)) {
    let newUrl;
    if (country === "USA Californie") {
      newUrl = getPlpUrl({ vintage: [millesime], region: [countryMapping[country]] }, lang);
    } else {
      newUrl = getPlpUrl({ vintage: [millesime], country: [countryMapping[country]] }, lang);
    }

    return {
      redirect: {
        destination: newUrl,
        statusCode: 301,
      },
    };
  } else {
    return {
      props: {
        error: "Both millesime and region/country parameters are required.",
      },
    };
  }
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default Page;
