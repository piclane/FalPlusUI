import {AppBar, AppBarProps, IconButton, Toolbar, Typography} from "@mui/material";
import {ArrowBack, CleaningServices, Tv} from "@mui/icons-material";
import {Link as RouterLink, To, useLocation, useNavigate} from "react-router-dom";
import React from "react";
import './AppTopHeader.scss';

export interface AppTopHeaderProps extends AppBarProps {
  backTo?: () => To
}

const AppTopHeader = React.forwardRef((props: AppTopHeaderProps, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    position = 'fixed',
    color = 'transparent',
    backTo,
    ...restProps
  } = props;
  const navigations = [{
    to: "/recordings",
    label: '録画',
    icon: <Tv />
  }, {
    to: "/cleaner?vt=TS",
    label: '掃除',
    icon: <CleaningServices />
  }];

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
        {navigations.map(n => {
          const m = /^([^?#]+)/.exec(n.to);
          const selected = m && location.pathname.startsWith(m[1]);
          return (
            <IconButton
              key={n.to}
              to={n.to}
              aria-label={n.label}
              component={RouterLink}
              className={`${selected ? 'selected' : ''}`}
            >
              {n.icon}
            </IconButton>
          );
        })}
      </Toolbar>
    </AppBar>
  );
});

export default AppTopHeader;
