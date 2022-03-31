import React from "react";
import {
  Backdrop,
  Box,
  Card,
  CardContent, CardHeader,
  CircularProgress, createTheme,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack, ThemeProvider,
  Typography
} from "@mui/material";
import {Subtitle} from "@/Model";
import {gql, useQuery} from "@apollo/client";
import {Link as RouterLink, useParams} from "react-router-dom";
import {safeParseInt} from "@/utils/TypeUtil";
import SubtitleCard from "@/components/organisms/SubtitleCard";
import "./RecordingDetail.scss"
import {Duration} from "luxon";
import {downloadFile} from "@/utils/FileUtil";

const GET_SUBTITLE = gql`
    query GetSubtitle(
        $pId: Int!
    ) {
        subtitle(pId: $pId) {
            pId
            tId
            subtitle
            countNo
            startDateTime
            duration
            fileStatus
            thumbnailUri
            thumbnailUris
            tsVideoUri
            sdVideoUri
            hdVideoUri
            cmEdit {
                detectThreshold
                tsRule
                mp4Rule
            }
            dropInfoSummary {
                totalSum
                dropSum
                scramblingSum
            }
            station {
                stationName
                digitalStationBand
            }
            program {
                tId
                title
            }
            keywordGroups {
                keywordGroupId
                keyword
            }
        }
    }
`;

const CM_EDIT_DETECT_THRESHOLDS = Object.freeze({
  OFF: 'オフ',
  LOW: '弱',
  MEDIUM: '中',
  HIGH: '強',
});

const CM_EDIT_RULES = Object.freeze({
  DO_NOTHING: '編集しない',
  DELETE_CM: '本編のみ (CMカット)',
  LEAVE_ONLY_CM: 'CMのみ (本編カット)',
  SORT_CM: '本編+CM(同尺並べ替え)',
  ADD_CHAPTERS: 'チャプタ追加',
});

function uri2filename(uri: string | null): string | null {
  if(!uri) {
    return null;
  }
  const lastSlash = uri.lastIndexOf('/');
  if(lastSlash >= 0) {
    return uri.substring(lastSlash + 1);
  } else {
    return uri;
  }
}

function handleDownloadVideo(uri: string | null | undefined) {
  if(uri) {
    downloadFile(uri, uri2filename(uri)!);
  }
}

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #888',
          borderRadius: '4px'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #888',
          padding: '5px 16px',
          backgroundColor: '#d7d4ff',
        },
        title: {
          fontFamily: "'Titillium Web', sans-serif",
          fontSize: '14px',
          fontWeight: '500',
          color: 'black',
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingTop: '5px',
          paddingBottom: '5px !important'
        }
      }
    }
  }
});

function Detail({subtitle: s}: {subtitle: Subtitle}) {
  const dropRatio = (s.dropInfoSummary?.dropSum ?? 1) / (s.dropInfoSummary?.totalSum ?? 1) * 100.0;
  const dropRatioFormatter = new Intl.NumberFormat('ja-JP', {style: 'percent', maximumFractionDigits: 2});

  return (
    <SubtitleCard className="subtitle-detail-card" subtitle={s} detail>
      <ThemeProvider theme={theme}>
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'row' }}
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={2}
          sx={{ padding: '0 0 16px' }}
        >
          <Card className="cm-edit">
            <CardHeader title="CM" />
            <CardContent component="dl">
              <dt>CM検出</dt><dd>{CM_EDIT_DETECT_THRESHOLDS[s.cmEdit.detectThreshold]}</dd>
              <dt>MPEG2 CM</dt><dd>{CM_EDIT_RULES[s.cmEdit.tsRule]}</dd>
              <dt>MP4 CM</dt><dd>{CM_EDIT_RULES[s.cmEdit.mp4Rule]}</dd>
            </CardContent>
          </Card>
          {s.dropInfoSummary
            ? <Card className="drop-info">
              <CardHeader title="DropInfo" />
                <CardContent component="dl">
                  <dt>ドロップ率</dt>
                  <dd>{isNaN(dropRatio) ? '-' : dropRatioFormatter.format(dropRatio)}</dd>
                </CardContent>
              </Card>
            : <></>
          }
          <Card className="videos">
            <CardHeader title="Downloads" />
            <CardContent component={List}>
              {s.tsVideoUri
                ? <ListItem disablePadding>
                    <ListItemIcon>
                      <img src="/images/icon/ic_mpeg2.png" alt="TS Video" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link
                        href={s.tsVideoUri}
                        underline="hover"
                        target="_blank"
                        rel="noopener"
                        variant="caption"
                        onClick={e => {handleDownloadVideo(s.tsVideoUri); e.preventDefault();}}
                      >{uri2filename(s.tsVideoUri)}</Link>
                    </ListItemText>
                  </ListItem>
                : <></>
              }
              {s.sdVideoUri
                ? <ListItem disablePadding>
                    <ListItemIcon>
                      <img src="/images/icon/ic_mp4SD.png" alt="SD Video" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link
                        href={s.sdVideoUri}
                        underline="hover"
                        target="_blank"
                        rel="noopener"
                        variant="caption"
                        onClick={e => {handleDownloadVideo(s.sdVideoUri); e.preventDefault();}}
                      >{uri2filename(s.sdVideoUri)}</Link>
                    </ListItemText>
                  </ListItem>
                : <></>
              }
              {s.hdVideoUri
                ? <ListItem disablePadding>
                    <ListItemIcon>
                      <img src="/images/icon/ic_mp4HD.png" alt="HD Video" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link
                        href={s.hdVideoUri}
                        underline="hover"
                        target="_blank"
                        rel="noopener"
                        variant="caption"
                        onClick={e => {handleDownloadVideo(s.hdVideoUri); e.preventDefault();}}
                      >{uri2filename(s.hdVideoUri)}</Link>
                    </ListItemText>
                  </ListItem>
                : <></>
              }
            </CardContent>
          </Card>
        </Stack>
      </ThemeProvider>
    </SubtitleCard>
  );
}

function Thumbnails({subtitle: s}: {subtitle: Subtitle}) {
  return (
    <div className="thumbnails">
      {s.thumbnailUris?.map((t, index) => {
        const time = 5 + index * 10;
        const duration = Duration.fromObject({seconds: time});
        return (
          <Link key={index} className="thumbnail" to={`/player/${s.pId}?t=${time}`} component={RouterLink}>
            <img
              src={t}
              loading="lazy"
              alt={`${time}秒`}
            />
            <span>{duration.toFormat(time > 3600 ? "h:mm:ss" : "m:ss")}</span>
          </Link>
        )
      }) ?? <></>}
    </div>
  );
}

export default function RecordingDetail() {
  const {pId} = useParams();
  const { loading, error, data } = useQuery<{subtitle: Subtitle}>(GET_SUBTITLE, {
    variables: {
      pId: safeParseInt(pId)
    }
  });

  if(loading || !data) {
    return (
      <Box>
        <Backdrop
          sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
          open>
          <CircularProgress color="inherit"/>
        </Backdrop>
      </Box>
    );
  } else if (error) {
    return (
      <Box>
        <Backdrop
          sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
          open>
          <Typography variant="h3">読込に失敗しました</Typography>
        </Backdrop>
      </Box>
    );
  } else {
    return (
      <Box  className="recording-detail" sx={{padding: '16px'}}>
        <Detail subtitle={data.subtitle}/>
        <Thumbnails subtitle={data.subtitle}/>
      </Box>
    );
  }
}
