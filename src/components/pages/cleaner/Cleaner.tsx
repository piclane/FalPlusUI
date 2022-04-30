import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Switch,
  Typography
} from "@mui/material";
import DiskInfo, {ChartDataType} from "@/components/pages/recording/list/DiskInfo";
import QueryForm from "@/components/organisms/QueryForm";
import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import AppHeader from "@/components/atoms/AppHeader";
import {
  toggleVideoType,
  useSearchVideoTypes,
  useSubtitleQueryInput
} from "@/components/pages/recording/list/SearchParams";
import InfiniteSubtitles, {InfiniteSubtitlesMethods} from "@/components/organisms/InfiniteSubtitles";
import SubtitleCard from "@/components/organisms/SubtitleCard";
import "./Cleaner.scss";
import {VIDEO_TYPES} from "@/Constants";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {Scalars, SubtitleQueryInput, SubtitleResult} from "@/Model";
import NumberFormat from 'react-number-format';
import {lightGreen, red} from "@mui/material/colors";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {isNumber} from "@/utils/TypeUtil";

const FETCH_VIDEO_SIZES = gql`
    query FindSubtitles(
        $query: SubtitleQueryInput,
        $offset: Int!,
        $limit: Int!,
        $contextData: String
    ) {
        subtitles(query: $query, offset: $offset, limit: $limit, contextData: $contextData) {
            total
            contextData
            data {
                tsVideoSize
                sdVideoSize
                hdVideoSize
            }
        }
    }
`;

const DELETE_VIDEOS = gql`
    mutation DeleteVideos(
        $query: SubtitleQueryInput!,
        $physical: Boolean!
    ) {
        deleteSubtitleVideoByQuery(input: $query, physical: $physical)
    }
`;

const GET_JOB_PROGRESS = gql`
    query GetJobProgress(
        $job: Job!
    ) {
        jobProgress(job: $job)
    }
`;

function delay(timeout: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  })
}

interface SubtitlesProps {
  subtitleQueryInput: SubtitleQueryInput;
}

interface SubtitlesMethods {
  refresh(): void;
}

const Subtitles = React.forwardRef<SubtitlesMethods, SubtitlesProps>((
  {subtitleQueryInput}: SubtitlesProps,
  ref
) => {
  const infiniteSubtitlesRef = useRef<InfiniteSubtitlesMethods>(null);
  useImperativeHandle(ref, () => ({
    refresh() {
      infiniteSubtitlesRef.current?.refresh();
    }
  }));

  return (
    <InfiniteSubtitles
      query={subtitleQueryInput}
      render={subtitles => (
        <Grid
          container
          direction="row"
          spacing={2}
          justifyContent="start"
          alignItems="stretch"
        >
          {subtitles.map(s => (
            <Grid key={`cleaner-${s.pId}`} item xs={12} md={12} lg={6} xl={4}>
              <SubtitleCard
                subtitle={s}
                sx={{height: '100%'}}
                footer={<span className="videos">
                  {Object.values(VIDEO_TYPES).map(vt => isNumber(vt.videoSize(s))
                    ? <img key={vt.videoType} src={vt.icon} alt={vt.name} />
                    : <React.Fragment key={vt.videoType}></React.Fragment>
                  )}
                </span>}
                mini
              />
            </Grid>
          )) ?? <></>}
        </Grid>
      )}
      ref={infiniteSubtitlesRef}
    />
  );
});

interface QueryContext {
  contextData: string;
  query: SubtitleQueryInput;
  offset: number;
  limit: number;
  totalSubtitleCount: number;
  totalVideoSize: number;
  totalVideoCount: number;
  valid: boolean;
  complete: boolean;
}

interface SummaryProps {
  onQueryContextChanged: (queryContext: QueryContext) => void;
}

export interface SummaryMethods {
  refresh(): void;
}

const Summary = React.forwardRef<SummaryMethods, SummaryProps>((
  {onQueryContextChanged}: SummaryProps,
  ref
) => {
  const limit = 100;
  const [videoTypes] = useSearchVideoTypes();
  const queryInput = useSubtitleQueryInput({includeNowRecording: false, fileStatuses: ["ALL_COMPLETE"]});
  const [queryContext, setQueryContext] = useState<QueryContext>({
    contextData: `${Date.now()}`,
    query: queryInput,
    offset: 0,
    limit,
    totalSubtitleCount: 0,
    totalVideoSize: 0,
    totalVideoCount: 0,
    valid: false,
    complete: false,
  } as QueryContext);
  const [fetch] = useLazyQuery<{subtitles: SubtitleResult}>(FETCH_VIDEO_SIZES, {
    notifyOnNetworkStatusChange: true,
    onCompleted(result) {
      if(queryContext.contextData !== result.subtitles.contextData || !queryContext.valid) {
        return;
      }
      const sizes = result.subtitles.data;
      let videoSizeSum = 0;
      let videoCountSum = 0;
      for (const size of sizes) {
        for (const videoType of videoTypes) {
          const videoSize = VIDEO_TYPES[videoType].videoSize(size);
          if(videoSize !== null) {
            videoSizeSum += videoSize;
            videoCountSum++;
          }
        }
      }
      setQueryContext(prev => ({
        ...prev,
        offset: sizes.length > 0 ? prev.offset + sizes.length : prev.offset,
        totalSubtitleCount: result.subtitles.total,
        totalVideoSize: prev.totalVideoSize + videoSizeSum,
        totalVideoCount: prev.totalVideoCount + videoCountSum,
        complete: sizes.length === 0
      }));
    },
  });
  const refresh = () => {
    const ctx: QueryContext = {
      ...queryContext,
      contextData: `${Date.now()}`,
      query: queryInput,
      totalSubtitleCount: 0,
      totalVideoSize: 0,
      totalVideoCount: 0,
      valid: true,
      complete: false,
    };
    if(videoTypes.length === 0) {
      ctx.valid = false;
      ctx.complete = true;
    } else if(queryContext.offset === 0) {
      fetch({
        variables: {
          query: ctx.query,
          offset: ctx.offset,
          limit: ctx.limit,
          contextData: ctx.contextData,
        },
      });
    } else {
      ctx.offset = 0;
    }
    setQueryContext(ctx);
  };
  useEffect(() => {
    return () => {
      setQueryContext(prev => ({...prev, valid: false}));
    };
  }, []);
  useEffect(() => {
    refresh();
  }, [queryInput]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if(queryContext.valid) {
      setTimeout(() => {
        if(queryContext.valid) {
          fetch({
            variables: {
              query: queryContext.query,
              offset: queryContext.offset,
              limit: queryContext.limit,
              contextData: queryContext.contextData,
            }
          });
        }
      }, 500);
    }
  }, [queryContext.offset]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    onQueryContextChanged(queryContext);
  }, [queryContext]); // eslint-disable-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => ({
    refresh() {
      refresh();
    }
  }));

  return (
    <DiskInfo modifyChartData={(chartData: ChartDataType) => {
      if(queryContext.valid) {
        chartData['will-free'] = {
          name: '空き予定',
          value: queryContext.totalVideoSize,
          color: lightGreen[500],
          appendix: (<>
            <NumberFormat value={queryContext.totalVideoCount} displayType="text" suffix="動画" thousandSeparator/>
          </>)
        };
        chartData.used.value -= queryContext.totalVideoSize;
      }
      return chartData;
    }} />
  )
});

export default function Cleaner() {
  const [videoTypes, setVideoTypes] = useSearchVideoTypes();
  const [queryContext, setQueryContext] = useState<QueryContext | null>(null);
  const queryInput = useSubtitleQueryInput({includeNowRecording: false, fileStatuses: ["ALL_COMPLETE"]});
  const [deleteVideos] = useMutation<{deleteSubtitleVideoByQuery: Scalars['Job']}>(DELETE_VIDEOS);
  const [jobRunning, setJobRunning] = useState<boolean>(false);
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [fetchJobProgress] = useLazyQuery<{jobProgress: number}>(GET_JOB_PROGRESS);
  const summaryRef = useRef<SummaryMethods>(null);
  const subtitlesRef = useRef<SubtitlesMethods>(null);
  const handleDelete = async () => {
    const rcSwal = withReactContent(Swal)
    let physical = false;
    const result = await rcSwal.fire({
      icon: "warning",
      title: '動画削除の確認',
      html: (<>
        <NumberFormat value={queryContext?.totalVideoCount} displayType="text" thousandSeparator/>
        動画が削除されます。本当によろしいですか？
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ paddingTop: '16px' }}>
          <Typography>論理削除</Typography>
          <Switch color="error" onChange={(_, checked) => physical = checked}/>
          <Typography>物理削除</Typography>
        </Stack>
      </>),
      confirmButtonColor: red[900],
      showCancelButton: true,
      focusCancel: true,
      allowEnterKey: false,
    });
    if(result.value === true) {
      setJobRunning(true);
      setJobProgress(0);
      try {
        const {data} = await deleteVideos({
          variables: {
            query: queryInput,
            physical
          }
        });
        if (!data) {
          alert("削除に失敗しました");
          return;
        }
        const {deleteSubtitleVideoByQuery: job} = data;
        while (true) {
          await delay(200);
          const {data} = await fetchJobProgress({
            variables: {
              job
            }
          });
          const {jobProgress} = data ?? {jobProgress: 0};
          setJobProgress(jobProgress * 100);
          if (jobProgress === 1) {
            break;
          }
        }
      } finally {
        subtitlesRef.current?.refresh();
        summaryRef.current?.refresh();
        setJobRunning(false);
        await delay(500);
        setJobProgress(0);
      }
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column' }}
        open={jobRunning}
      >
        <Typography variant="h4">
          動画を削除しています...
        </Typography>
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={jobProgress ?? 0}
          sx={{ width: '40vw', height: '16px', marginTop: '32px' }}
        />
      </Backdrop>
      <Box sx={{padding: '5px 16px 16px'}} className="cleaner">
        <AppHeader>
          <Box className="app-header-wrapper cleaner">
            <Box className="row upper">
              <Summary onQueryContextChanged={setQueryContext} ref={summaryRef} />
              <div style={{ flexGrow: 1 }} />
              <List dense disablePadding sx={{marginRight: "20px"}}>
                {Object.values(VIDEO_TYPES).map(vt => (
                  <ListItem key={vt.videoType} dense disablePadding>
                    <ListItemButton sx={{paddingTop: '2px', paddingBottom: '2px'}}>
                      <ListItemIcon sx={{minWidth: 0}}>
                        <Checkbox
                          checked={videoTypes?.includes(vt.videoType)}
                          onChange={e => setVideoTypes(toggleVideoType(videoTypes, vt.videoType, e.target.checked))}
                          edge="start"
                          tabIndex={-1}
                          size="small"
                          sx={{padding: 0}}
                        />
                      </ListItemIcon>
                    </ListItemButton>
                    <img src={vt.icon} alt={vt.name} />
                  </ListItem>
                ))}
              </List>
              <QueryForm />
            </Box>
            <Box className="row lower">
              <Button variant="contained" size="medium" color="error" disabled={queryContext?.valid !== true || queryContext?.complete !== true} onClick={handleDelete}>
                {(() => {
                  if(queryContext?.complete !== true) {
                    return (<>
                      <span style={{ marginRight: '0.2em' }}>集計中... </span>
                      <CircularProgress size={12} />
                    </>);
                  } else if (queryContext?.valid !== true) {
                    return '削除条件を設定してください';
                  } else {
                    return <NumberFormat value={queryContext.totalVideoCount} displayType="text" prefix="条件に一致する " suffix=" 動画を削除..." thousandSeparator/>;
                  }
                })()}
              </Button>
            </Box>
          </Box>
        </AppHeader>
        <Divider sx={{border: '0 none', marginBottom: '16px'}} />
        <Subtitles
          subtitleQueryInput={queryInput}
          ref={subtitlesRef}
        />
      </Box>
    </>
  );
}
