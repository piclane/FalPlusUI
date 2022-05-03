import {
  Checkbox,
  createTheme,
  FormControl,
  FormControlLabel,
  Grid,
  ThemeProvider
} from "@mui/material";
import React from "react";

import QuerySelect from "@/components/organisms/QuerySelect";
import {Sort} from "@mui/icons-material";
import {useSearchOrder, useSearchQuery} from "@/components/organisms/SearchParams";

const theme = createTheme({
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.8rem'
        },
        root: {
          marginRight: '15px'
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '5px 3px 5px 0'
        }
      }
    }
  }
});

export default function QueryForm() {
  const [query, setQuery] = useSearchQuery();
  const [order, {setDirection}] = useSearchOrder();
  return (
    <FormControl sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <ThemeProvider theme={theme}>
        <Grid container sx={{
          width: 'auto',
          maxWidth: 'calc(100vw - 32px)',
          [theme.breakpoints.up('md')]: {
            width: '500px'
          }
        }}>
          <Grid item xs={12}>
            <QuerySelect query={query} setQuery={setQuery} />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={order.direction === 'Ascending'}
                  icon={<Sort />}
                  checkedIcon={<Sort sx={{ transform: 'scale(1, -1)' }} />}
                  onChange={e => setDirection(e.target.checked ? 'Ascending' : 'Descending')}
                />
              }
              label="" />

            <FormControlLabel
              control={
                <Checkbox
                  checked={query?.mode === 'program'}
                  onChange={e => {
                    if(e.target.checked) {
                      setQuery({mode: 'program'});
                    } else {
                      setQuery(null);
                    }
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="アニメ自動録画" />

            <FormControlLabel
              control={
                <Checkbox
                  checked={query?.mode === 'keyword'}
                  onChange={e => {
                    if(e.target.checked) {
                      setQuery({mode: 'keyword'});
                    } else {
                      setQuery(null);
                    }
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="キーワード録画" />

            <FormControlLabel
              sx={{marginRight: 0}}
              control={
                <Checkbox
                  checked={query?.mode === 'epg'}
                  onChange={e => {
                    if(e.target.checked) {
                      setQuery({mode: 'epg'});
                    } else {
                      setQuery(null);
                    }
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="EPG 録画" />
          </Grid>
        </Grid>
      </ThemeProvider>
    </FormControl>
  );
}
