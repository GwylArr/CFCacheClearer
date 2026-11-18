import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UUIButtonElement, UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { getSites, postPurgePath, postPurgeTags, postPurgeAll } from "../api/index.js";
import type { SiteModel } from "../api/index.js";

interface SiteState {
  path: string;
  tags: string;
  lastMessage?: string;
}

@customElement("cf-cache-clearer-dashboard")
export class CfCacheClearerDashboardElement extends UmbElementMixin(LitElement) {
  @state()
  private _sites: SiteModel[] = [];

  @state()
  private _siteState: Record<number, SiteState> = {};

  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });

    this.#loadSites();
  }

  async #loadSites() {
    const { data } = await tryExecute(this, getSites());
    this._sites = data ?? [];
  }

  #stateFor(siteIndex: number): SiteState {
    return this._siteState[siteIndex] ?? { path: "", tags: "" };
  }

  #setState(siteIndex: number, patch: Partial<SiteState>) {
    this._siteState = {
      ...this._siteState,
      [siteIndex]: { ...this.#stateFor(siteIndex), ...patch },
    };
  }

  #notify = (headline: string, message: string, isError: boolean) => {
    this.#notificationContext?.peek(isError ? "danger" : "positive", {
      data: { headline, message },
    });
  };

  #onPathInput = (siteIndex: number) => (ev: Event) => {
    this.#setState(siteIndex, { path: (ev.target as UUIInputElement).value as string });
  };

  #onTagsInput = (siteIndex: number) => (ev: Event) => {
    this.#setState(siteIndex, { tags: (ev.target as UUIInputElement).value as string });
  };

  #onClickPurgePath = (siteIndex: number) => async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    const path = this.#stateFor(siteIndex).path.trim();

    if (!path) {
      this.#notify("Enter a path", "Please enter a path to purge before continuing.", true);
      return;
    }

    buttonElement.state = "waiting";

    const { data, error } = await tryExecute(
      this,
      postPurgePath({ body: { siteIndex, path } })
    );

    if (error || !data) {
      buttonElement.state = "failed";
      this.#setState(siteIndex, { lastMessage: "Something went wrong purging that path." });
      this.#notify("Cache purge failed", this.#stateFor(siteIndex).lastMessage!, true);
      return;
    }

    buttonElement.state = data.success ? "success" : "failed";
    this.#setState(siteIndex, { lastMessage: data.message });
    this.#notify(data.success ? "Cache purge requested" : "Cache purge failed", data.message, !data.success);
  };

  #onClickPurgeTags = (siteIndex: number) => async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    const tags = this.#stateFor(siteIndex)
      .tags.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (!tags.length) {
      this.#notify("Enter a tag", "Please enter at least one tag to purge before continuing.", true);
      return;
    }

    buttonElement.state = "waiting";

    const { data, error } = await tryExecute(this, postPurgeTags({ body: { siteIndex, tags } }));

    if (error || !data) {
      buttonElement.state = "failed";
      this.#setState(siteIndex, { lastMessage: "Something went wrong purging those tags." });
      this.#notify("Cache purge failed", this.#stateFor(siteIndex).lastMessage!, true);
      return;
    }

    buttonElement.state = data.success ? "success" : "failed";
    this.#setState(siteIndex, { lastMessage: data.message });
    this.#notify(data.success ? "Cache purge requested" : "Cache purge failed", data.message, !data.success);
  };

  #onClickPurgeAll = (siteIndex: number) => async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;

    const confirmed = window.confirm(
      "This will purge the cache for the entire site in Cloudflare. Are you sure you want to continue?"
    );
    if (!confirmed) {
      return;
    }

    buttonElement.state = "waiting";

    const { data, error } = await tryExecute(this, postPurgeAll({ body: { siteIndex } }));

    if (error || !data) {
      buttonElement.state = "failed";
      this.#setState(siteIndex, { lastMessage: "Something went wrong purging the entire site's cache." });
      this.#notify("Cache purge failed", this.#stateFor(siteIndex).lastMessage!, true);
      return;
    }

    buttonElement.state = data.success ? "success" : "failed";
    this.#setState(siteIndex, { lastMessage: data.message });
    this.#notify(data.success ? "Cache purge requested" : "Cache purge failed", data.message, !data.success);
  };

  #renderSite(site: SiteModel) {
    const state = this.#stateFor(site.index);

    return html`
      <uui-box headline=${site.baseUrl}>
        <div class="site-content">
          <div class="action">
            <p>
              Enter a path (e.g. <code>/news/some-article/</code>) to purge that page from the
              Cloudflare cache.
            </p>
            <uui-input
              label="Path to purge"
              placeholder="/path/to/purge/"
              .value=${state.path}
              @input=${this.#onPathInput(site.index)}
            ></uui-input>
            <uui-button
              color="default"
              look="primary"
              label="Purge path"
              @click=${this.#onClickPurgePath(site.index)}
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
              .value=${state.tags}
              @input=${this.#onTagsInput(site.index)}
            ></uui-input>
            <uui-button
              color="default"
              look="primary"
              label="Purge tags"
              @click=${this.#onClickPurgeTags(site.index)}
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
              @click=${this.#onClickPurgeAll(site.index)}
            >
              Purge entire site
            </uui-button>
          </div>
        </div>

        ${state.lastMessage ? html`<p class="result">${state.lastMessage}</p>` : ""}
      </uui-box>
    `;
  }

  render() {
    if (!this._sites.length) {
      return html`<uui-box headline="CF Cache Clearer">
        <p>No Cloudflare sites are configured.</p>
      </uui-box>`;
    }

    return html`${this._sites.map((site) => this.#renderSite(site))}`;
  }

  static styles = [
    css`
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
    `,
  ];
}

export default CfCacheClearerDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "cf-cache-clearer-dashboard": CfCacheClearerDashboardElement;
  }
}
