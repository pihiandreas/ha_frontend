import type { HassEntity } from "home-assistant-js-websocket";
import { computeStateDomain } from "../../common/entity/compute_state_domain";
import {
  DOMAINS_HIDE_DEFAULT_MORE_INFO,
  DOMAINS_WITH_MORE_INFO,
} from "./const";

const LAZY_LOADED_MORE_INFO_CONTROL = {
  alarm_control_panel: () => import("./controls/more-info-alarm_control_panel"),
  automation: () => import("./controls/more-info-automation"),
  climate: () => import("./controls/more-info-climate"),
  configurator: () => import("./controls/more-info-configurator"),
  counter: () => import("./controls/more-info-counter"),
  cover: () => import("./controls/more-info-cover"),
  date: () => import("./controls/more-info-date"),
  datetime: () => import("./controls/more-info-datetime"),
  fan: () => import("./controls/more-info-fan"),
  group: () => import("./controls/more-info-group"),
  image: () => import("./controls/more-info-image"),
  input_boolean: () => import("./controls/more-info-input_boolean"),
  input_datetime: () => import("./controls/more-info-input_datetime"),
  light: () => import("./controls/more-info-light"),
  lock: () => import("./controls/more-info-lock"),
  remote: () => import("./controls/more-info-remote"),
  script: () => import("./controls/more-info-script"),
  siren: () => import("./controls/more-info-siren"),
  switch: () => import("./controls/more-info-switch"),
  time: () => import("./controls/more-info-time"),
  timer: () => import("./controls/more-info-timer"),
  update: () => import("./controls/more-info-update"),
  weather: () => import("./controls/more-info-weather"),
};

export const stateMoreInfoType = (stateObj: HassEntity): string => {
  const domain = computeStateDomain(stateObj);
  return domainMoreInfoType(domain);
};

export const domainMoreInfoType = (domain: string): string => {
  if (DOMAINS_WITH_MORE_INFO.includes(domain)) {
    return domain;
  }
  if (DOMAINS_HIDE_DEFAULT_MORE_INFO.includes(domain)) {
    return "hidden";
  }
  return "default";
};

export const importMoreInfoControl = (type: string) => {
  if (!(type in LAZY_LOADED_MORE_INFO_CONTROL)) {
    return;
  }
  LAZY_LOADED_MORE_INFO_CONTROL[type]();
};
