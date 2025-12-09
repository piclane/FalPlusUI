/// <reference types="react-scripts" />

/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;
  export default ReactComponent;
}
