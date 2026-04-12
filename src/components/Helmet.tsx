import * as React from 'react';

interface OtherElementAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

type HtmlProps = React.JSX.IntrinsicElements['html'] & OtherElementAttributes;

type BodyProps = React.JSX.IntrinsicElements['body'] & OtherElementAttributes;

type LinkProps = React.JSX.IntrinsicElements['link'];

type MetaProps = React.JSX.IntrinsicElements['meta'];

export interface HelmetTags {
  baseTag: HTMLBaseElement[];
  linkTags: HTMLLinkElement[];
  metaTags: HTMLMetaElement[];
  noscriptTags: HTMLElement[];
  scriptTags: HTMLScriptElement[];
  styleTags: HTMLStyleElement[];
}

export interface HelmetProps {
  async?: boolean | undefined;
  base?: HTMLBaseElement | Record<string, string>;
  bodyAttributes?: BodyProps | undefined;
  children?: React.ReactNode;
  defaultTitle?: string | undefined;
  defer?: boolean | undefined;
  encodeSpecialCharacters?: boolean | undefined;
  htmlAttributes?: HtmlProps | undefined;
  onChangeClientState?:
    | ((newState: HelmetPropsToState, addedTags: HelmetTags, removedTags: HelmetTags) => void)
    | undefined;
  link?: LinkProps[] | undefined;
  meta?: MetaProps[] | undefined;
  noscript?: HTMLElement[] | undefined;
  script?: HTMLScriptElement[] | undefined;
  style?: HTMLStyleElement[] | undefined;
  title?: string | undefined;
  titleAttributes?: object | undefined;
  titleTemplate?: string | undefined;
}

/**
 * Used by Helmet.peek()
 */
export type HelmetPropsToState = HelmetTags &
  Pick<
    HelmetProps,
    | 'bodyAttributes'
    | 'defer'
    | 'htmlAttributes'
    | 'onChangeClientState'
    | 'title'
    | 'titleAttributes'
  > & {
    encode: Required<HelmetProps['encodeSpecialCharacters']>;
  };

// Type definitions (kept for reference)
// declare class Helmet extends React.Component<HelmetProps> {
//   static peek(): HelmetPropsToState;
//   static rewind(): HelmetData;
//   static renderStatic(): HelmetData;
//   static canUseDOM: boolean;
// }

// Runtime implementation for Helmet component
const HelmetImpl: React.FC<HelmetProps> = ({ 
  title, 
  meta
}) => {
  React.useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Update meta tags
    if (meta) {
      const oldMetas = document.head.querySelectorAll('meta[data-helmet="true"]');
      oldMetas.forEach(tag => tag.remove());
      
      meta.forEach(m => {
        const element = document.createElement('meta');
        Object.entries(m).forEach(([key, value]) => {
          if (value != null) {
            element.setAttribute(key, String(value));
          }
        });
        element.setAttribute('data-helmet', 'true');
        document.head.appendChild(element);
      });
    }
  }, [title, meta]);
  
  return null;
};

export { HelmetImpl as Helmet };
export default HelmetImpl;

export interface HelmetData {
  base: HelmetDatum;
  bodyAttributes: HelmetHTMLBodyDatum;
  htmlAttributes: HelmetHTMLElementDatum;
  link: HelmetDatum;
  meta: HelmetDatum;
  noscript: HelmetDatum;
  script: HelmetDatum;
  style: HelmetDatum;
  title: HelmetDatum;
  titleAttributes: HelmetDatum;
}

export interface HelmetDatum {
  toString(): string;
  toComponent(): React.ReactElement;
}

export interface HelmetHTMLBodyDatum {
  toString(): string;
  toComponent(): React.HTMLAttributes<HTMLBodyElement>;
}

export interface HelmetHTMLElementDatum {
  toString(): string;
  toComponent(): React.HTMLAttributes<HTMLHtmlElement>;
}

export declare const canUseDOM: boolean;
