import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

import {
  buildUrl,
  defaultLocale,
  generateTranslatedUrlRedirectionPerLocale,
  generateTranslatedUrlRewritePerLocale,
  Locale,
  translatedLinks,
  urlMatchPath,
} from "./urls/linksTranslation";
import { createRouteFromUrl, createUrlFromRoute } from "./utils/algoliaUrls";
import { encodedQueryParamsSeparator } from "./utils/constants";
import { isNotNullNorUndefined, ObjectKeys } from "./utils/ts-utils";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};

const PUBLIC_FILE = /\.(.*)$/;

const isPublicOrApiOrNext = (pathname: string) => {
  const isOnPLP = Object.values(translatedLinks.BUY_WINE_URL).some(path =>
    pathname.startsWith(path),
  );

  // quick fix to allow writing the dot character in the PLP search bar in translated urls
  if (isOnPLP) return false;

  return pathname.startsWith("/_next") || pathname.includes("/api/") || PUBLIC_FILE.test(pathname);
};

// Rewrite because url like /en/sell-my-wines should use path /en/vendre-mes-vins
const translatedUrlRewritePerLocale = generateTranslatedUrlRewritePerLocale() as {
  [key: string]: { [key: string]: string };
};
const dynamicTranslatedUrlRewritePerLocale = generateTranslatedUrlRewritePerLocale(true) as {
  [key: string]: { [key: string]: string };
};

const removeRouteParamsFromSearchString = (search: string, params: Record<string, unknown>) => {
  // remove redundant params
  const searchParams = new URLSearchParams(search);
  ObjectKeys(params).forEach(key => searchParams.delete(key));

  return searchParams.toString() !== "" ? "?" + searchParams.toString() : "";
};

const getEncodedQueryParams = (searchString: string) => {
  const queryParams = searchString.split("?")[1] as string | undefined;
  const hasQueryParams = isNotNullNorUndefined(queryParams);

  const encodedQueryParams = hasQueryParams ? Buffer.from(queryParams).toString("base64") : "";
  const encodedQueryParamsWithSeparator = hasQueryParams
    ? encodedQueryParamsSeparator + encodedQueryParams
    : "";

  return encodedQueryParamsWithSeparator;
};

export const withRewriteTranslatedUrlAndPdpEncodedQueryParams: MiddlewareFactory = (
  next: NextMiddleware,
) => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    if (isPublicOrApiOrNext(req.nextUrl.pathname)) return next(req, _next);

    const currentLocale = req.nextUrl.locale;

    const searchString = req.nextUrl.search;

    const pdpStartPath = translatedLinks.PDP_SAMPLE_URL[currentLocale as Locale].split("/")[1];
    const isOnPDP = req.nextUrl.pathname.split("/")[1] === pdpStartPath;
    const shouldEncodeQueryParams = isOnPDP;

    if (currentLocale === defaultLocale) {
      return shouldEncodeQueryParams
        ? NextResponse.rewrite(
            new URL(
              `/${currentLocale}${req.nextUrl.pathname}${getEncodedQueryParams(searchString)}`,
              req.url,
            ),
          )
        : next(req, _next);
    }

    const rewrite = translatedUrlRewritePerLocale[currentLocale][req.nextUrl.pathname];

    if (isNotNullNorUndefined(rewrite) && rewrite !== req.nextUrl.pathname) {
      const rewriteWithPrefix = `/${currentLocale}${rewrite}`;

      return NextResponse.rewrite(
        new URL(
          rewriteWithPrefix +
            (shouldEncodeQueryParams ? getEncodedQueryParams(searchString) : searchString),
          req.url,
        ),
      );
    }

    const dynamicRewriteKey = Object.keys(dynamicTranslatedUrlRewritePerLocale[currentLocale]).find(
      path => urlMatchPath(req.nextUrl.pathname, path),
    );

    if (isNotNullNorUndefined(dynamicRewriteKey)) {
      const destinationRewrite =
        dynamicTranslatedUrlRewritePerLocale[currentLocale][dynamicRewriteKey];
      if (destinationRewrite !== dynamicRewriteKey) {
        const { params } = urlMatchPath(req.nextUrl.pathname, dynamicRewriteKey) as {
          params: Record<string, unknown>;
        };
        const destUrl = buildUrl(destinationRewrite, params);
        const destUrlWithPrefix = `/${currentLocale}${destUrl}`;
        const cleanSearchString = removeRouteParamsFromSearchString(searchString, params);

        return NextResponse.rewrite(
          new URL(
            destUrlWithPrefix +
              (shouldEncodeQueryParams
                ? getEncodedQueryParams(cleanSearchString)
                : cleanSearchString),
            req.url,
          ),
        );
      }
    }

    return shouldEncodeQueryParams
      ? NextResponse.rewrite(
          new URL(
            `/${currentLocale}${req.nextUrl.pathname}${getEncodedQueryParams(searchString)}`,
            req.url,
          ),
        )
      : next(req, _next);
  };
};

// Forbid and redirect url like /fr/sell-my-wines or /en/vendre-mes-vin
const translatedUrlRedirection = generateTranslatedUrlRedirectionPerLocale() as {
  [key: string]: { [key: string]: string };
};
const dynamicTranslatedUrlRedirection = generateTranslatedUrlRedirectionPerLocale(true) as {
  [key: string]: { [key: string]: string };
};
const withRedirectToRestrictTranslatedUrlPerLocale: MiddlewareFactory = (next: NextMiddleware) => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    if (isPublicOrApiOrNext(req.nextUrl.pathname)) return next(req, _next);

    const currentLocale = req.nextUrl.locale;
    const redirection = translatedUrlRedirection[currentLocale][req.nextUrl.pathname];
    const redirectionWithPrefix = `/${currentLocale}${redirection}`;

    if (isNotNullNorUndefined(redirection) && redirection !== req.nextUrl.pathname) {
      return NextResponse.redirect(
        new URL(redirectionWithPrefix + req.nextUrl.search, req.url),
        301,
      );
    }

    const dynamicRedirectionKey = Object.keys(dynamicTranslatedUrlRedirection[currentLocale]).find(
      path => urlMatchPath(req.nextUrl.pathname, path),
    );

    if (isNotNullNorUndefined(dynamicRedirectionKey)) {
      const destinationRedirection =
        dynamicTranslatedUrlRedirection[currentLocale][dynamicRedirectionKey];

      if (destinationRedirection !== dynamicRedirectionKey) {
        const { params } = urlMatchPath(req.nextUrl.pathname, dynamicRedirectionKey) as {
          params: Record<string, unknown>;
        };
        const destUrl = buildUrl(destinationRedirection, params);
        const destUrlWithPrefix = `/${currentLocale}${destUrl}`;
        const searchString = removeRouteParamsFromSearchString(req.nextUrl.search, params);

        return NextResponse.redirect(new URL(destUrlWithPrefix + searchString, req.url), 301);
      }
    }

    return next(req, _next);
  };
};

const withRedirectToAddLangPrefix: MiddlewareFactory = (next: NextMiddleware) => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    if (isPublicOrApiOrNext(req.nextUrl.pathname)) return next(req, _next);

    if (req.nextUrl.locale === "default") {
      const locale = req.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;
      const pathnameWithoutTrailingSlash = req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname;

      return NextResponse.redirect(
        new URL(`/${locale}${pathnameWithoutTrailingSlash}${req.nextUrl.search}`, req.url),
        301,
      );
    }

    return next(req, _next);
  };
};

const cepages =
  "aglianico,aligote,altesse,arbane,baco,barbera,barbarossa,bourboulenc,cabernet-franc,cabernet-sauvignon,camaralet,carignan,cartoixa,carmenere,chardonnay,chenin-blanc,clairette,colombard,cinsault,corvina,counoise,dolcetto,douce-noire,la-folle-blanche,furmint,gamay,gewurztraminer,gibert,gros-manseng,grenache,grenache-blanc,grenache-gris,jacquere,jurancon-noir,lauzet,macabeu,malbec,malvoisie,marsanne,merlot,melon-de-bourgogne,mondeuse,mondeuse-blanche,mourvedre,mondeuse,montepulciano,muscardin,muscat,muscat-blanc-a-petits-grains,nebbiolo,nerello-capuccio,nerello-mascalese,nero-davola,negrette,niellucciu,noual,perdo-ximenez,pelaverga-piccolo,petit-manseng,petit-meslier,petit-verdot,persan,pinot-blanc,pinot-gris,pinot-meunier,pinot-noir,poulsard,riesling,ribolla-gialla,la-rondinella,roussanne,sangiovese,sauvignon-blanc,sauvignon-à-gros-grains,savagnin,sciaccarellu,semillon,sylvaner,syrah,tannat,tempranillo,terret-noir,trousseau,trebbiano,ugni,ugni-blanc,vaccarese,valdiguie,vermentino,zinfandel";

const cepagesNewPathStart = {
  fr: "/acheter-du-vin/cepage-",
  en: "/buy-wine/grape-variety-",
  it: "/compra-vino/vitigno-",
  de: "/wein-kaufen/rebsorte-",
};

const LOCALES = ["fr", "en", "de", "it"] as Array<"fr" | "en" | "de" | "it">;
const sourceLocalePart = (locale: string) => (locale === "en" ? "uk/uk" : locale);
interface CepageRedirects {
  [key: string]: { source: string; destination: string };
}

const cepagesRedirects: CepageRedirects = cepages
  .split(",")
  .map(cepage => {
    return LOCALES.map(locale => ({
      source: `${sourceLocalePart(locale)}/decouverte/cepage_${cepage}.jsp`,
      destination: `${cepagesNewPathStart[locale]}${cepage}`,
    }));
  })
  .flat()
  .reduce((acc: CepageRedirects, curr) => {
    acc[curr.source] = curr;

    return acc;
  }, {});

const withSeoRedirect: MiddlewareFactory = next => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const oldLocale = pathname.startsWith("/uk/") ? "uk" : req.nextUrl.locale;
    const pathnameWithLocale = `${oldLocale}${pathname}`;
    const shouldRedirectLegacyCepage = pathnameWithLocale in cepagesRedirects;

    if (shouldRedirectLegacyCepage) {
      const newLocale = pathname.startsWith("/uk/") ? "en" : req.nextUrl.locale;

      const redirectUrl = cepagesRedirects[pathnameWithLocale].destination;

      return NextResponse.redirect(new URL(`/${newLocale}${redirectUrl}`, req.url), 301);
    }

    const shouldRedirectForUkDomains = pathname.startsWith("/uk/domain/");
    if (shouldRedirectForUkDomains) {
      const splittedUrl = pathname.split("/");
      const slug = splittedUrl[splittedUrl.length - 1];
      const cleanSlug = slug.replace(".jsp", "");
      const domainName = cleanSlug.slice(cleanSlug.indexOf("-") + 1);
      const formattedDomainName = encodeURIComponent(domainName.replaceAll("-", " "));

      return NextResponse.redirect(
        new URL(`/en/buy-wine/domain-${formattedDomainName}`, req.url),
        301,
      );
    }

    const shouldRedirectForUkPlp = pathname.startsWith("/uk/buy-wine/");
    if (shouldRedirectForUkPlp) {
      const lang = "en";
      const splittedUrl = pathname.split("/");
      const currentSlug = splittedUrl[splittedUrl.length - 1];
      const cleanCurrentSlug = currentSlug.replace(".jsp", "");
      const filters = createRouteFromUrl(cleanCurrentSlug, lang);
      const regeneratedSlug = createUrlFromRoute(filters, lang);

      return NextResponse.redirect(new URL(`/en/buy-wine/${regeneratedSlug}`, req.url), 301);
    }

    return next(req, _next);
  };
};

const withBasicAuthCheck: MiddlewareFactory = next => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    const xForwardedFor = req.headers.get("x-forwarded-for") ?? "-";
    const cfConnectingIp = req.headers.get("CF-Connecting-IP") ?? "-";
    const clientIp = req.nextUrl.hostname.endsWith("idealwine.com")
      ? cfConnectingIp
      : xForwardedFor.split(",")[0];

    if (
      process.env.BASIC_AUTH_ENABLED !== "true" ||
      process.env.BASIC_AUTH_WHITELIST_IP_ADDRESSES?.split(",").includes(clientIp)
    ) {
      return next(req, _next);
    }

    const basicAuth = req.headers.get("authorization");
    if (basicAuth != null) {
      const authValue = basicAuth.split(" ")[1];
      const [user, password] = Buffer.from(authValue, "base64").toString("utf-8").split(":");
      if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
        return next(req, _next);
      }
    }
    const url = req.nextUrl;
    url.pathname = "/api/auth";

    return NextResponse.rewrite(url);
  };
};

const withCfProxySecretCheck: MiddlewareFactory = next => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    if (
      process.env.CUSTOM_CF_PROXY_SECRET === undefined ||
      req.headers.get("custom-cf-proxy-secret") === process.env.CUSTOM_CF_PROXY_SECRET
    ) {
      return next(req, _next);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  };
};

const stackMiddlewares = (functions: MiddlewareFactory[] = [], index = 0): NextMiddleware => {
  const current = functions[index];
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
  if (current) {
    const next = stackMiddlewares(functions, index + 1);

    return current(next);
  }

  return () => NextResponse.next();
};

const middlewares = [
  withBasicAuthCheck,
  withCfProxySecretCheck,
  withSeoRedirect,
  withRedirectToAddLangPrefix,
  withRedirectToRestrictTranslatedUrlPerLocale,
  withRewriteTranslatedUrlAndPdpEncodedQueryParams,
];
export const middleware = stackMiddlewares(middlewares);
