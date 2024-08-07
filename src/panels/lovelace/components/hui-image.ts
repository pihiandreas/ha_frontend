import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";
import { STATES_OFF } from "../../../common/const";
import { computeDomain } from "../../../common/entity/compute_domain";
import parseAspectRatio from "../../../common/util/parse-aspect-ratio";
import "../../../components/ha-circular-progress";
import { UNAVAILABLE } from "../../../data/entity";
import { computeImageUrl, ImageEntity } from "../../../data/image";
import { HomeAssistant } from "../../../types";

const DEFAULT_FILTER = "grayscale(100%)";

const enum LoadState {
  Loading = 1,
  Loaded = 2,
  Error = 3,
}

export interface StateSpecificConfig {
  [state: string]: string;
}

@customElement("hui-image")
export class HuiImage extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property() public entity?: string;

  @property() public image?: string;

  @property({ attribute: false }) public stateImage?: StateSpecificConfig;

  @property() public cameraImage?: string;

  @property() public cameraView?: "live" | "auto";

  @property() public aspectRatio?: string;

  @property() public filter?: string;

  @property({ attribute: false }) public stateFilter?: StateSpecificConfig;

  @property() public darkModeImage?: string;

  @property() public darkModeFilter?: string;

  @property() public fitMode?: "cover" | "contain" | "fill";

  @state() private _imageVisible? = false;

  @state() private _loadState?: LoadState;

  @state() private _cameraImageSrc?: string;

  @state() private _loadedImageSrc?: string;

  @state() private _lastImageHeight?: number;

  private _intersectionObserver?: IntersectionObserver;

  private _cameraUpdater?: number;

  private _ratio: {
    w: number;
    h: number;
  } | null = null;

  public connectedCallback(): void {
    super.connectedCallback();
    if (this._loadState === undefined) {
      this._loadState = LoadState.Loading;
    }
    if (this.cameraImage && this.cameraView !== "live") {
      this._startIntersectionObserverOrUpdates();
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopIntersectionObserver();
    this._imageVisible = undefined;
  }

  protected handleIntersectionCallback(entries: IntersectionObserverEntry[]) {
    this._imageVisible = entries[0].isIntersecting;
  }

  public willUpdate(changedProps: PropertyValues): void {
    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass") as HomeAssistant | undefined;

      if (this._shouldStartCameraUpdates(oldHass)) {
        this._startIntersectionObserverOrUpdates();
      } else if (!this.hass!.connected) {
        this._stopIntersectionObserver();
        this._loadState = LoadState.Loading;
        this._cameraImageSrc = undefined;
        this._loadedImageSrc = undefined;
      }
    }
    if (changedProps.has("aspectRatio")) {
      this._ratio = this.aspectRatio
        ? parseAspectRatio(this.aspectRatio)
        : null;
    }
    if (this._loadState === LoadState.Loading && !this.cameraImage) {
      this._loadState = LoadState.Loaded;
    }
  }

  protected render() {
    if (!this.hass) {
      return nothing;
    }
    const useRatio = Boolean(
      this._ratio && this._ratio.w > 0 && this._ratio.h > 0
    );
    const stateObj = this.entity ? this.hass.states[this.entity] : undefined;
    const entityState = stateObj ? stateObj.state : UNAVAILABLE;

    // Figure out image source to use
    let imageSrc: string | undefined;
    // Track if we are we using a fallback image, used for filter.
    let imageFallback = !this.stateImage;

    if (this.stateImage) {
      const stateImage = this.stateImage[entityState];

      if (stateImage) {
        imageSrc = stateImage;
      } else {
        imageSrc = this.image;
        imageFallback = true;
      }
    } else if (this.darkModeImage && this.hass.themes.darkMode) {
      imageSrc = this.darkModeImage;
    } else if (stateObj && computeDomain(stateObj.entity_id) === "image") {
      imageSrc = computeImageUrl(stateObj as ImageEntity);
    } else {
      imageSrc = this.image;
    }

    if (imageSrc) {
      imageSrc = this.hass.hassUrl(imageSrc);
    }

    // Figure out filter to use
    let filter = this.filter || "";

    if (this.hass.themes.darkMode && this.darkModeFilter) {
      filter += this.darkModeFilter;
    }

    if (this.stateFilter && this.stateFilter[entityState]) {
      filter += this.stateFilter[entityState];
    }

    if (!filter && this.entity) {
      const isOff = !stateObj || STATES_OFF.includes(entityState);
      filter = isOff && imageFallback ? DEFAULT_FILTER : "";
    }

    return html`
      <div
        style=${styleMap({
          paddingBottom: useRatio
            ? `${((100 * this._ratio!.h) / this._ratio!.w).toFixed(2)}%`
            : this._lastImageHeight === undefined
              ? "56.25%"
              : undefined,
          backgroundImage:
            useRatio && this._loadedImageSrc
              ? `url("${this._loadedImageSrc}")`
              : undefined,
          filter:
            this._loadState === LoadState.Loaded || this.cameraView === "live"
              ? filter
              : undefined,
        })}
        class="container ${classMap({
          ratio: useRatio || this._lastImageHeight === undefined,
          contain: this.fitMode === "contain",
          fill: this.fitMode === "fill",
        })}"
      >
        <img
          id="image"
          src=${imageSrc!}
          alt="placeholder"
          @error=${this._onImageError}
          @load=${this._onImageLoad}
          style=${styleMap({
            display:
              useRatio || this._loadState === LoadState.Loaded
                ? "block"
                : "none",
          })}
        />
        ${this._loadState === LoadState.Error
          ? html`<div
              id="brokenImage"
              style=${styleMap({
                height: !useRatio
                  ? `${this._lastImageHeight}px` || "100%"
                  : undefined,
              })}
            ></div>`
          : this.cameraView !== "live" &&
              (imageSrc === undefined || this._loadState === LoadState.Loading)
            ? html`<div
                class="progress-container"
                style=${styleMap({
                  height: !useRatio
                    ? `${this._lastImageHeight}px` || "100%"
                    : undefined,
                })}
              >
                <ha-circular-progress
                  class="render-spinner"
                  indeterminate
                  size="small"
                ></ha-circular-progress>
              </div>`
            : ""}
      </div>
    `;
  }

  protected _shouldStartCameraUpdates(oldHass?: HomeAssistant): boolean {
    return !!(
      (!oldHass || oldHass.connected !== this.hass!.connected) &&
      this.hass!.connected &&
      this.cameraView !== "live"
    );
  }

  private _startIntersectionObserverOrUpdates(): void {
    if ("IntersectionObserver" in window) {
      if (!this._intersectionObserver) {
        this._intersectionObserver = new IntersectionObserver(
          this.handleIntersectionCallback.bind(this)
        );
      }
      this._intersectionObserver.observe(this);
    } else {
      // No support for IntersectionObserver
      // assume all images are visible
      this._imageVisible = true;
      // this._startUpdateCameraInterval();
    }
  }

  private _stopIntersectionObserver(): void {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
  }

  private _onImageError(): void {
    this._loadState = LoadState.Error;
  }

  private async _onImageLoad(ev: Event): Promise<void> {
    this._loadState = LoadState.Loaded;
    const imgEl = ev.target as HTMLImageElement;
    if (this._ratio && this._ratio.w > 0 && this._ratio.h > 0) {
      this._loadedImageSrc = imgEl.src;
    }
    await this.updateComplete;
    this._lastImageHeight = imgEl.offsetHeight;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      .container {
        transition: filter 0.2s linear;
        height: 100%;
      }

      img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
      }

      .progress-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ratio {
        position: relative;
        width: 100%;
        height: 0;
        background-position: center;
        background-size: cover;
      }
      .ratio.fill {
        background-size: 100% 100%;
      }
      .ratio.contain {
        background-size: contain;
        background-repeat: no-repeat;
      }
      .fill img {
        object-fit: fill;
      }
      .contain img {
        object-fit: contain;
      }

      .ratio img,
      .ratio div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .ratio img {
        visibility: hidden;
      }

      #brokenImage {
        background: grey url("/static/images/image-broken.svg") center/36px
          no-repeat;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-image": HuiImage;
  }
}
