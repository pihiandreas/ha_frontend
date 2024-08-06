import { css, unsafeCSS } from "lit";

export const fontStyles = css`
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Thin"),
      local("Roboto-Thin"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-100-normal.woff2)
        format("woff2");
    font-weight: 100;
    font-style: normal;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Thin Italic"),
      local("Roboto-ThinItalic"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-100-italic.woff2)
        format("woff2");
    font-weight: 100;
    font-style: italic;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Light"),
      local("Roboto-Light"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-300-normal.woff2)
        format("woff2");
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Light Italic"),
      local("Roboto-LightItalic"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-300-italic.woff2)
        format("woff2");
    font-weight: 300;
    font-style: italic;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Regular"),
      local("Roboto-Regular"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-400-normal.woff2)
        format("woff2");
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Italic"),
      local("Roboto-Italic"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-400-italic.woff2)
        format("woff2");
    font-weight: 400;
    font-style: italic;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Medium"),
      local("Roboto-Medium"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-500-normal.woff2)
        format("woff2");
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Medium Italic"),
      local("Roboto-MediumItalic"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-500-italic.woff2)
        format("woff2");
    font-weight: 500;
    font-style: italic;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Bold"),
      local("Roboto-Bold"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-700-normal.woff2)
        format("woff2");
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Bold Italic"),
      local("Roboto-BoldItalic"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-700-italic.woff2)
        format("woff2");
    font-weight: 700;
    font-style: italic;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Black"),
      local("Roboto-Black"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-900-normal.woff2)
        format("woff2");
    font-weight: 900;
    font-style: normal;
  }
  @font-face {
    font-family: "Roboto";
    src:
      local("Roboto Black Italic"),
      local("Roboto-BlackItalic"),
      url(${unsafeCSS(
          __STATIC_PATH__
        )}fonts/roboto/roboto-latin-ext-900-italic.woff2)
        format("woff2");
    font-weight: 900;
    font-style: italic;
  }
`.toString();
