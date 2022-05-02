import React from "react";
import {AppBar, AppBarProps, createTheme, ThemeProvider, Toolbar, Typography} from "@mui/material";
import {DateTime} from "luxon";
import {gql, useQuery} from "@apollo/client";

const FETCH_API_VERSION = gql`
    query {
        version
    }
`;

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          top: 'auto',
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
          backdropFilter: 'saturate(5) blur(10px)'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 'auto !important',
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'rgba(220,220,220,.9)',
          fontSize: '12px',
          fontWeight: "400",
          fontFamily: "'Akshar', sans-serif",
          marginRight: '0.5em'
        }
      }
    }
  }
});

interface AppBottomFooterProps extends AppBarProps {

}

const AppBottomFooter = React.forwardRef<HTMLDivElement, AppBottomFooterProps>((props: AppBottomFooterProps, ref) => {
  const {
    position = 'fixed',
    color = 'transparent',
    ...restProps
  } = props;
  const {data: apiVersionData} = useQuery<{version: string}>(FETCH_API_VERSION);
  const commitDateTime = process.env.REACT_APP_COMMIT_DATETIME;
  const crYear = (commitDateTime ? DateTime.fromISO(commitDateTime) : DateTime.now()).toFormat("yyyy");
  const crUiVersion = `v${process.env.REACT_APP_VERSION}`;
  const crApiVersion = apiVersionData ? `v${apiVersionData?.version}` : '...';

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        {...restProps}
        className="app-bottom-footer"
        position={position}
        color={color}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        ref={ref}
        component="footer"
      >
        <Toolbar className="app-bottom-footer-tool-bar">
          <Typography variant="body1">&copy; { crYear } piclane.</Typography>
          <Typography variant="body1">FAL+UI { crUiVersion }</Typography>
          <Typography variant="body1">FAL+API { crApiVersion }</Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
});

export default AppBottomFooter;
