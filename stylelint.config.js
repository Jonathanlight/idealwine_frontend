module.exports = {
  extends: [
    "stylelint-config-sass-guidelines",
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-prettier/recommended",
    "stylelint-config-prettier",
  ],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    "function-name-case": ["lower", { ignoreFunctions: ["/^[a-z][a-zA-Z0-9]+$/"] }], // camelCase
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$", // camelCase
    "keyframes-name-pattern": "^[a-z][a-zA-Z0-9]+$", // camelCase
    "scss/dollar-variable-pattern": "^[a-z][a-zA-Z0-9]+$", // camelCase
    "scss/at-function-pattern": "^[a-z][a-zA-Z0-9]+$", // camelCase
    "scss/at-mixin-pattern": "^[a-z][a-zA-Z0-9]+$", // camelCase
    "scss/percent-placeholder-pattern": "^[a-z][a-zA-Z0-9]+$", // camelCase

    "color-hex-length": "long",

    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,

    /*
     * These rules are here to prevent CSS bad practices.
     * Most of the time they introduce tech debt, checkout the links above each rule for more info.
     * When some of these rules are not relevant (there are rare edge cases), you can
     * // stylelint-disable-next-line
     * Check with a member of the CSS guild if you have any doubt
     */
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-important
    "declaration-no-important": true,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-id-in-selectors
    "selector-max-id": 0,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-more-than-two-classes-in-selectors
    "selector-max-class": 2,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-html-tags-in-selectors
    "selector-max-type": [0, { ignoreTypes: ["html", "body", "thead", "tbody", "tr", "th", "td"] }],
    "max-nesting-depth": 2,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-hardcoded-values
    "scale-unlimited/declaration-strict-value": [
      [
        "font-size",
        "color",
        "background-color",
        "border-color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
        "fill",
      ],
      {
        ignoreKeywords: ["transparent", "inherit", "initial", "unset", "none", "current"],

        // to avoid warning "No `autoFix` function provided, consider using `disableFix`"
        // We don't use the disableFix option as it breaks the autoFix on save feature in VS Code
        autoFixFunc: () => undefined,
      },
    ],
    "custom-property-pattern": null,
    "scss/function-no-unknown": null,
    "scss/no-global-function-names": null,
    "declaration-property-value-disallowed-list": [
      { overflow: ["scroll"], "overflow-x": ["scroll"], "overflow-y": ["scroll"] },
      { message: "Use 'auto' instead of 'scroll' to avoid empty scrollbar on Windows" },
    ],
  },
};
