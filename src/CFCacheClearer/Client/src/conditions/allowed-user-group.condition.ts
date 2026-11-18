import type { UmbConditionConfigBase } from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { getAccess } from "../api/index.js";

export class CFCacheClearerAllowedUserGroupCondition extends UmbConditionBase<UmbConditionConfigBase> {
  constructor(host: UmbControllerHost, args: { config: UmbConditionConfigBase; onChange: (permitted: boolean) => void }) {
    super(host, args);

    this.permitted = false;

    this.#checkAccess();
  }

  async #checkAccess() {
    const { data } = await tryExecute(this, getAccess());
    this.permitted = data?.allowed ?? false;
  }
}

export default CFCacheClearerAllowedUserGroupCondition;
