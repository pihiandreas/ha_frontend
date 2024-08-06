import { css, unsafeCSS } from "lit";

export const fontStyles = css`
  @font-face {
    font-family: "Cairo";
    font-style: normal;
    font-weight: 300 800;
    src: url(${unsafeCSS(
        __STATIC_PATH__
      )}fonts/cairo-variable/cairo-latin-wght-normal.woff2)
      format("woff2-variations");
  }
`.toString();
