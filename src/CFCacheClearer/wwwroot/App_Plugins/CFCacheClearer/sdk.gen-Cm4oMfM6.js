import { c } from "./client.gen-hKULoR1S.js";
const r = (e) => (e?.client ?? c).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/cfcacheclearer/api/v1/access",
  ...e
}), t = (e) => (e?.client ?? c).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/cfcacheclearer/api/v1/sites",
  ...e
}), s = (e) => (e?.client ?? c).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/cfcacheclearer/api/v1/purge-all",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), p = (e) => (e?.client ?? c).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/cfcacheclearer/api/v1/purge-path",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
}), h = (e) => (e?.client ?? c).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/cfcacheclearer/api/v1/purge-tags",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e?.headers
  }
});
export {
  h as a,
  s as b,
  r as c,
  t as g,
  p
};
//# sourceMappingURL=sdk.gen-Cm4oMfM6.js.map
