import {AppBar, AppBarProps, IconButton, Toolbar, Typography} from "@mui/material";
import {ArrowBack, CleaningServices, Tv} from "@mui/icons-material";
import {Link as RouterLink, To, useNavigate} from "react-router-dom";
import React from "react";
import './AppTopHeader.scss';

export interface AppTopHeaderProps extends AppBarProps {
  backTo?: () => To
}

const AppTopHeader = React.forwardRef((props: AppTopHeaderProps, ref) => {
  const navigate = useNavigate();
  const {
    position = 'fixed',
    color = 'transparent',
    backTo,
    ...restProps
  } = props;
  return (
    <AppBar
      {...restProps}
      className="app-top-header"
      position={position}
      color={color}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      // @ts-ignore
      ref={ref}
    >
      <Toolbar className="app-top-header-tool-bar">
        <IconButton onClick={() => backTo ? navigate(backTo()) : navigate(-1)} aria-label="戻る">
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" noWrap>
          FAL+
        </Typography>
        <IconButton to="/recordings" aria-label="録画" component={RouterLink}>
          <Tv />
        </IconButton>
        <IconButton aria-label="掃除">
          <CleaningServices />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
});

export default AppTopHeader;
