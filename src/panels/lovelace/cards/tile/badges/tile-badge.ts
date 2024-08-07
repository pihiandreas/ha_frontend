import { mdiExclamationThick } from "@mdi/js";
import { HassEntity } from "home-assistant-js-websocket";
import { TemplateResult, html, nothing } from "lit";
import { styleMap } from "lit/directives/style-map";
import { computeDomain } from "../../../../../common/entity/compute_domain";
import { UNAVAILABLE, UNKNOWN } from "../../../../../data/entity";
import { HomeAssistant } from "../../../../../types";
import { renderClimateBadge } from "./tile-badge-climate";
import "../../../../../components/tile/ha-tile-badge";
import "../../../../../components/ha-svg-icon";

export type RenderBadgeFunction = (
  stateObj: HassEntity,
  hass: HomeAssistant
) => TemplateResult | typeof nothing;

export const renderTileBadge: RenderBadgeFunction = (stateObj, hass) => {
  if (stateObj.state === UNKNOWN) {
    return nothing;
  }
  if (stateObj.state === UNAVAILABLE) {
    return html`
      <ha-tile-badge
        style=${styleMap({
          "--tile-badge-background-color": "var(--orange-color)",
        })}
      >
        <ha-svg-icon .path=${mdiExclamationThick}></ha-svg-icon>
      </ha-tile-badge>
    `;
  }
  const domain = computeDomain(stateObj.entity_id);
  switch (domain) {
    case "person":
    case "climate":
      return renderClimateBadge(stateObj, hass);
    default:
      return nothing;
  }
};
