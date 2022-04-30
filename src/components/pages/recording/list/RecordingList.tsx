import React from "react";
import {Box, Divider, Grid} from "@mui/material";
import SubtitleCard from "@/components/organisms/SubtitleCard";
import QueryForm from "@/components/organisms/QueryForm";
import AppHeader from "@/components/atoms/AppHeader";
import './RecordingList.scss';
import DiskInfo from "@/components/pages/recording/list/DiskInfo";
import {
  buildSearchParams,
  useSearchOrder,
  useSearchQuery,
  useSubtitleQueryInput
} from "@/components/pages/recording/list/SearchParams";
import InfiniteSubtitles from "@/components/organisms/InfiniteSubtitles";

function Subtitles() {
  const [query] = useSearchQuery();
  const [order] = useSearchOrder();
  const queryInput = useSubtitleQueryInput();
  return (
    <InfiniteSubtitles
      query={queryInput}
      render={subtitles => (
        <Grid
          container
          direction="row"
          spacing={2}
          justifyContent="start"
          alignItems="stretch"
        >
          {subtitles.map(s => (
            <Grid key={`recording-list-${s.pId}`} item xs={12} md={12} lg={6} xl={4}>
              <SubtitleCard
                subtitle={s}
                sx={{height: '100%'}}
                playerPath={s => {
                  const searchParams = buildSearchParams({query, order});
                  searchParams.set('continuous', 'true');
                  return `/recordings/player/${s.pId}?${searchParams}`;
                }}
                hover
              />
            </Grid>
          )) ?? <></>}
        </Grid>
      )}
    />
  );
}

export default function RecordingList() {
  return (
    <Box sx={{padding: '5px 16px 16px'}}>
      <AppHeader>
        <Box className="app-header-wrapper recording-list">
          <DiskInfo />
          <div style={{ flexGrow: 1 }} />
          <QueryForm />
        </Box>
      </AppHeader>
      <Divider sx={{border: '0 none', marginBottom: '16px'}} />
      <Subtitles />
    </Box>
  );
}
