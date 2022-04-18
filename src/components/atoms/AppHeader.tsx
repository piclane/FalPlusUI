import React from 'react';
import {Portal} from "@mui/material";

export default function AppHeader({children}: {
  children?: React.ReactNode,
}) {
  const node = document.getElementById("app-header");
  return (
    <Portal container={node}>
      {children}
    </Portal>
  );
}
