import { CFCACHE_CLEARER_ALLOWED_USER_GROUP_CONDITION_ALIAS } from "../conditions/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "CF Cache Clearer Dashboard",
    alias: "CFCacheClearer.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "CF Cache Clearer",
      pathname: "cf-cache-clearer",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
      {
        alias: CFCACHE_CLEARER_ALLOWED_USER_GROUP_CONDITION_ALIAS,
      },
    ],
  },
];
