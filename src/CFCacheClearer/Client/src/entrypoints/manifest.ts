export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "CFCache Clearer Entrypoint",
    alias: "CFCacheClearer.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
