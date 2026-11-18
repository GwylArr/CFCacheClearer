import { CFCACHE_CLEARER_ALLOWED_USER_GROUP_CONDITION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "CF Cache Clearer Allowed User Group Condition",
    alias: CFCACHE_CLEARER_ALLOWED_USER_GROUP_CONDITION_ALIAS,
    type: "condition",
    js: () => import("./allowed-user-group.condition.js"),
  },
];
