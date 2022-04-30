import React from 'react';
import {Portal} from "@mui/material";

export default function AppFooter({children}: {
  children?: React.ReactNode,
}) {
  const node = document.getElementById("app-footer");
  return (
    <Portal container={node}>
      {children}
    </Portal>
  );
}
