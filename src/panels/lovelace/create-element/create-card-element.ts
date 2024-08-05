import { LovelaceCardConfig } from "../../../data/lovelace/config/card";
import "../cards/hui-button-card";
import "../cards/hui-calendar-card";
import "../cards/hui-entities-card";
import "../cards/hui-entity-button-card";
import "../cards/hui-entity-card";
import "../cards/hui-glance-card";
import "../cards/hui-grid-card";
import "../cards/hui-light-card";
import "../cards/hui-sensor-card";
import "../cards/hui-thermostat-card";
import "../cards/hui-tile-card";
import "../cards/hui-weather-forecast-card";
import {
  createLovelaceElement,
  getLovelaceElementClass,
  tryCreateLovelaceElement,
} from "./create-element-base";

const ALWAYS_LOADED_TYPES = new Set([
  "entity",
  "entities",
  "button",
  "entity-button",
  "glance",
  "grid",
  "section",
  "light",
  "sensor",
  "thermostat",
  "weather-forecast",
  "tile",
]);

const LAZY_LOAD_TYPES = {
  "alarm-panel": () => import("../cards/hui-alarm-panel-card"),
  area: () => import("../cards/hui-area-card"),
  calendar: () => import("../cards/hui-calendar-card"),
  conditional: () => import("../cards/hui-conditional-card"),
  "empty-state": () => import("../cards/hui-empty-state-card"),
  "entity-filter": () => import("../cards/hui-entity-filter-card"),
  error: () => import("../cards/hui-error-card"),
  gauge: () => import("../cards/hui-gauge-card"),
  "history-graph": () => import("../cards/hui-history-graph-card"),
  "horizontal-stack": () => import("../cards/hui-horizontal-stack-card"),
  iframe: () => import("../cards/hui-iframe-card"),
  logbook: () => import("../cards/hui-logbook-card"),
  map: () => import("../cards/hui-map-card"),
  markdown: () => import("../cards/hui-markdown-card"),
  "picture-elements": () => import("../cards/hui-picture-elements-card"),
  "picture-entity": () => import("../cards/hui-picture-entity-card"),
  "picture-glance": () => import("../cards/hui-picture-glance-card"),
  picture: () => import("../cards/hui-picture-card"),
  "plant-status": () => import("../cards/hui-plant-status-card"),
  "recovery-mode": () => import("../cards/hui-recovery-mode-card"),
  "todo-list": () => import("../cards/hui-todo-list-card"),
  "shopping-list": () => import("../cards/hui-shopping-list-card"),
  starting: () => import("../cards/hui-starting-card"),
  "statistics-graph": () => import("../cards/hui-statistics-graph-card"),
  statistic: () => import("../cards/hui-statistic-card"),
  "vertical-stack": () => import("../cards/hui-vertical-stack-card"),
};

// This will not return an error card but will throw the error
export const tryCreateCardElement = (config: LovelaceCardConfig) =>
  tryCreateLovelaceElement(
    "card",
    config,
    ALWAYS_LOADED_TYPES,
    LAZY_LOAD_TYPES,
    undefined,
    undefined
  );

export const createCardElement = (config: LovelaceCardConfig) =>
  createLovelaceElement(
    "card",
    config,
    ALWAYS_LOADED_TYPES,
    LAZY_LOAD_TYPES,
    undefined,
    undefined
  );

export const getCardElementClass = (type: string) =>
  getLovelaceElementClass(type, "card", ALWAYS_LOADED_TYPES, LAZY_LOAD_TYPES);
