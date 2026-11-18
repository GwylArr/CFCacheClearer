const e = [
  {
    name: "CFCache Clearer Entrypoint",
    alias: "CFCacheClearer.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-D17FUX4Q.js")
  }
], a = "CFCacheClearer.Condition.AllowedUserGroup", t = [
  {
    name: "CF Cache Clearer Dashboard",
    alias: "CFCacheClearer.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-MQVwPU4x.js"),
    meta: {
      label: "CF Cache Clearer",
      pathname: "cf-cache-clearer"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      },
      {
        alias: a
      }
    ]
  }
], n = [
  {
    name: "CF Cache Clearer Allowed User Group Condition",
    alias: a,
    type: "condition",
    js: () => import("./allowed-user-group.condition-DnhrvcuC.js")
  }
], o = [
  ...e,
  ...t,
  ...n
];
export {
  o as manifests
};
//# sourceMappingURL=cf-cache-clearer.js.map
