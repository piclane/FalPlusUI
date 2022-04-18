import * as React from 'react';
import {Box, Drawer, List, ListItemButton, ListItemText, Toolbar} from "@mui/material";
import {Link} from "react-router-dom";

const navigations = Object.freeze([
  {
    text: "録画",
    path: "/recordings",
  }
]);

export default function NavigationDrawer() {
  return <Drawer variant="permanent">
    <Toolbar/>
    <Box sx={{overflow: 'auto'}}>
      <List>
        {navigations.map(({text, path}, index) => (
          <ListItemButton key={path}>
            <Link to={path}><ListItemText primary={text} /></Link>
          </ListItemButton>
        ))}
      </List>
    </Box>
  </Drawer>
}
