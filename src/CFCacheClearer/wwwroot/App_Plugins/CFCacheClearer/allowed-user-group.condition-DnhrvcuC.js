import { UmbConditionBase as s } from "@umbraco-cms/backoffice/extension-registry";
import { tryExecute as o } from "@umbraco-cms/backoffice/resources";
import { c as r } from "./sdk.gen-Cm4oMfM6.js";
class l extends s {
  constructor(e, t) {
    super(e, t), this.permitted = !1, this.#e();
  }
  async #e() {
    const { data: e } = await o(this, r());
    this.permitted = e?.allowed ?? !1;
  }
}
export {
  l as CFCacheClearerAllowedUserGroupCondition,
  l as default
};
//# sourceMappingURL=allowed-user-group.condition-DnhrvcuC.js.map
