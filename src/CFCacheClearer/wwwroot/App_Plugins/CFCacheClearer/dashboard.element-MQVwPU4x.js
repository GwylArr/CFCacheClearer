import { LitElement as $, html as _, css as W, state as E, customElement as O } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as x } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as z } from "@umbraco-cms/backoffice/notification";
import { tryExecute as f } from "@umbraco-cms/backoffice/resources";
import { p as A, a as D, b as N, g as U } from "./sdk.gen-Cm4oMfM6.js";
var q = Object.defineProperty, F = Object.getOwnPropertyDescriptor, k = (t) => {
  throw TypeError(t);
}, v = (t, e, s, c) => {
  for (var a = c > 1 ? void 0 : c ? F(e, s) : e, o = t.length - 1, g; o >= 0; o--)
    (g = t[o]) && (a = (c ? g(e, s, a) : g(a)) || a);
  return c && a && q(e, s, a), a;
}, C = (t, e, s) => e.has(t) || k("Cannot " + s), l = (t, e, s) => (C(t, e, "read from private field"), e.get(t)), u = (t, e, s) => e.has(t) ? k("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), B = (t, e, s, c) => (C(t, e, "write to private field"), e.set(t, s), s), r = (t, e, s) => (C(t, e, "access private method"), s), m, i, S, p, h, n, w, y, b, P, M, T;
let d = class extends x($) {
  constructor() {
    super(), u(this, i), this._sites = [], this._siteState = {}, u(this, m), u(this, n, (t, e, s) => {
      l(this, m)?.peek(s ? "danger" : "positive", {
        data: { headline: t, message: e }
      });
    }), u(this, w, (t) => (e) => {
      r(this, i, h).call(this, t, { path: e.target.value });
    }), u(this, y, (t) => (e) => {
      r(this, i, h).call(this, t, { tags: e.target.value });
    }), u(this, b, (t) => async (e) => {
      const s = e.target, c = r(this, i, p).call(this, t).path.trim();
      if (!c) {
        l(this, n).call(this, "Enter a path", "Please enter a path to purge before continuing.", !0);
        return;
      }
      s.state = "waiting";
      const { data: a, error: o } = await f(
        this,
        A({ body: { siteIndex: t, path: c } })
      );
      if (o || !a) {
        s.state = "failed", r(this, i, h).call(this, t, { lastMessage: "Something went wrong purging that path." }), l(this, n).call(this, "Cache purge failed", r(this, i, p).call(this, t).lastMessage, !0);
        return;
      }
      s.state = a.success ? "success" : "failed", r(this, i, h).call(this, t, { lastMessage: a.message }), l(this, n).call(this, a.success ? "Cache purge requested" : "Cache purge failed", a.message, !a.success);
    }), u(this, P, (t) => async (e) => {
      const s = e.target, c = r(this, i, p).call(this, t).tags.split(",").map((g) => g.trim()).filter((g) => g.length > 0);
      if (!c.length) {
        l(this, n).call(this, "Enter a tag", "Please enter at least one tag to purge before continuing.", !0);
        return;
      }
      s.state = "waiting";
      const { data: a, error: o } = await f(this, D({ body: { siteIndex: t, tags: c } }));
      if (o || !a) {
        s.state = "failed", r(this, i, h).call(this, t, { lastMessage: "Something went wrong purging those tags." }), l(this, n).call(this, "Cache purge failed", r(this, i, p).call(this, t).lastMessage, !0);
        return;
      }
      s.state = a.success ? "success" : "failed", r(this, i, h).call(this, t, { lastMessage: a.message }), l(this, n).call(this, a.success ? "Cache purge requested" : "Cache purge failed", a.message, !a.success);
    }), u(this, M, (t) => async (e) => {
      const s = e.target;
      if (!window.confirm(
        "This will purge the cache for the entire site in Cloudflare. Are you sure you want to continue?"
      ))
        return;
      s.state = "waiting";
      const { data: a, error: o } = await f(this, N({ body: { siteIndex: t } }));
      if (o || !a) {
        s.state = "failed", r(this, i, h).call(this, t, { lastMessage: "Something went wrong purging the entire site's cache." }), l(this, n).call(this, "Cache purge failed", r(this, i, p).call(this, t).lastMessage, !0);
        return;
      }
      s.state = a.success ? "success" : "failed", r(this, i, h).call(this, t, { lastMessage: a.message }), l(this, n).call(this, a.success ? "Cache purge requested" : "Cache purge failed", a.message, !a.success);
    }), this.consumeContext(z, (t) => {
      B(this, m, t);
    }), r(this, i, S).call(this);
  }
  render() {
    return this._sites.length ? _`${this._sites.map((t) => r(this, i, T).call(this, t))}` : _`<uui-box headline="CF Cache Clearer">
        <p>No Cloudflare sites are configured.</p>
      </uui-box>`;
  }
};
m = /* @__PURE__ */ new WeakMap();
i = /* @__PURE__ */ new WeakSet();
S = async function() {
  const { data: t } = await f(this, U());
  this._sites = t ?? [];
};
p = function(t) {
  return this._siteState[t] ?? { path: "", tags: "" };
};
h = function(t, e) {
  this._siteState = {
    ...this._siteState,
    [t]: { ...r(this, i, p).call(this, t), ...e }
  };
};
n = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakMap();
b = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
T = function(t) {
  const e = r(this, i, p).call(this, t.index);
  return _`
      <uui-box headline=${t.baseUrl}>
        <div class="site-content">
          <div class="action">
            <p>
              Enter a path (e.g. <code>/news/some-article/</code>) to purge that page from the
              Cloudflare cache.
            </p>
            <uui-input
              label="Path to purge"
              placeholder="/path/to/purge/"
              .value=${e.path}
              @input=${l(this, w).call(this, t.index)}
            ></uui-input>
            <uui-button
              color="default"
              look="primary"
              label="Purge path"
              @click=${l(this, b).call(this, t.index)}
            >
              Purge path
            </uui-button>
          </div>

          <div class="action">
            <p>
              Enter one or more cache tags (comma separated) to purge everything cached under
              those tags.
            </p>
            <uui-input
              label="Tags to purge"
              placeholder="tag-one, tag-two"
              .value=${e.tags}
              @input=${l(this, y).call(this, t.index)}
            ></uui-input>
            <uui-button
              color="default"
              look="primary"
              label="Purge tags"
              @click=${l(this, P).call(this, t.index)}
            >
              Purge tags
            </uui-button>
          </div>

          <div class="action">
            <p>This will purge the Cloudflare cache for every page on this site. Use with care.</p>
            <uui-button
              color="danger"
              look="primary"
              label="Purge entire site"
              @click=${l(this, M).call(this, t.index)}
            >
              Purge entire site
            </uui-button>
          </div>
        </div>

        ${e.lastMessage ? _`<p class="result">${e.lastMessage}</p>` : ""}
      </uui-box>
    `;
};
d.styles = [
  W`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-layout-1);
        padding: var(--uui-size-layout-1);
      }

      .site-content {
        display: grid;
        gap: var(--uui-size-layout-1);
        grid-template-columns: repeat(3, 1fr);
      }

      uui-input {
        width: 100%;
        margin-bottom: var(--uui-size-space-4);
      }

      .result {
        margin-top: var(--uui-size-space-4);
      }
    `
];
v([
  E()
], d.prototype, "_sites", 2);
v([
  E()
], d.prototype, "_siteState", 2);
d = v([
  O("cf-cache-clearer-dashboard")
], d);
const K = d;
export {
  d as CfCacheClearerDashboardElement,
  K as default
};
//# sourceMappingURL=dashboard.element-MQVwPU4x.js.map
