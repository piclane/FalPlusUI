import React, {useEffect, useMemo, useState} from "react";
import {Link as RouterLink, useNavigate, useParams, useSearchParams} from "react-router-dom";
import VideoPlayer, {VideoPlayerSource} from "@/components/atoms/VideoPlayer";
import videojs from 'video.js';
import {ApolloClient, gql, useApolloClient, useLazyQuery} from "@apollo/client";
import {Subtitle, SubtitleQueryInput, SubtitleResult} from "@/Model";
import {safeParseBoolean, safeParseInt} from "@/utils/TypeUtil";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  createTheme,
  IconButton,
  Link,
  SvgIcon,
  ThemeProvider,
  Typography,
} from "@mui/material";
import "./RecordingPlayer.scss";
import {normalizeTitle, safeNormalizeTitle} from "@/utils/SubtitleUtil";
import {Error, Pause, PlayArrow, PlayCircleOutline, QuestionMark} from "@mui/icons-material";
import {isDesktop, isIOS} from 'react-device-detect';
import AppTopHeader from "@/components/atoms/AppTopHeader";
import {
  buildSearchParams,
  useSearchOrder,
  useSearchQuery,
  useSubtitleQueryInput
} from "@/components/pages/recording/list/SearchParams";
import {ReactComponent as BackwardIcon} from '@/assets/icon_forward.svg';

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
            tsVideoUri
            sdVideoUri
            hdVideoUri
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

const FIND_SUBTITLES = gql`
    query FindSubtitles(
        $query: SubtitleQueryInput,
        $offset: Int!,
        $limit: Int!
    ) {
        subtitles(query: $query, offset: $offset, limit: $limit) {
            total
            data {
                pId
                tId
                subtitle
                countNo
                startDateTime
                duration
                fileStatus
                thumbnailUri
                tsVideoUri
                sdVideoUri
                hdVideoUri
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
    }
`;

const headerTheme = createTheme({
  palette: {
    text: {
      primary: "#FFFFFF"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '0 none',
          borderRadius: '0',
          boxShadow: "none",
        }
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      },
      variants: [{
        props: { variant: 'h1' },
        style: {
          fontSize: "3vmax",
          fontWeight: "bold",
          borderBottom: '1px solid rgba(255,255,255,.4)',
          marginBottom: "10px",
          paddingBottom: "5px",
        }
      }, {
        props: { variant: 'caption' },
        style: {
          fontSize: "1.3vmax"
        }
      }]
    }
  },
});

const timeControlTheme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          position: 'relative',
          color: 'white',
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 'calc(min(20vw, 60px))',
          filter: 'drop-shadow(3px 3px 5px rgba(0,0,0,.7))',
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          position: 'absolute',
          top: 'calc(50% + 1px)',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          fontFamily: "'Akshar', sans-serif",
          fontSize: '25px',
          textShadow: '1px 1px 3px black'
        }
      }
    }
  }
});

const nextVideoTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,.5)',
          backdropFilter: 'saturate(5) blur(10px)',
          border: '1px solid rgba(255, 255, 255, .5)'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "0 3px 3px",
          background: 'transparent'
        },
        title: {
          fontSize: "10px",
          color: 'white',
          paddingBottom: '3px'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      },
      variants: [{
        props: { variant: 'body1' },
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        }
      }, {
        props: { variant: 'body2' },
        style: {
          fontSize: "10px",
          display: "-webkit-box",
          overflow: 'hidden',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }
      }]
    }
  }
});

async function fetchNextSubtitle(client: ApolloClient<object>, query: SubtitleQueryInput, currentPid: number): Promise<Subtitle | null> {
  const {data: {subtitleOffset}} = await client.query<{subtitleOffset: number | null}>({
    query: gql`
        query GetSubtitleOffset(
            $query: SubtitleQueryInput,
            $pId: Int!
        ) {
            subtitleOffset(query: $query, pId: $pId)
        }
    `,
    variables: {
      query, pId: currentPid
    },
  });

  if(subtitleOffset === null) {
    return null;
  }

  const {data: {subtitles: {data}}} = await client.query<{subtitles: SubtitleResult}>({
    query: FIND_SUBTITLES,
    variables: {
      query,
      offset: subtitleOffset + 1,
      limit: 1
    }
  });

  if(Array.isArray(data) && data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

function useQueryParams() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  return useMemo(() => ({
    pId: safeParseInt(params.pId),
    time: safeParseInt(searchParams.get('t')),
    isContinuous: safeParseBoolean(searchParams.get('continuous')),
  }), [searchParams, params]);
}

type PlayerState = "ready" | "stopped" | "playing";

export interface PlayerProps {
  inactivityTimeout?: number;
}

export default function RecordingPlayer(props: PlayerProps) {
  const inactivityTimeout = props?.inactivityTimeout ?? (isDesktop ? 2000 : 10000);
  const client = useApolloClient();
  const navigate = useNavigate();
  const [state, setState] = useState<PlayerState>("ready");
  const [isUserActive, setUserActive] = useState<boolean>(true);
  const [nextSubtitle, setNextSubtitle] = useState<Subtitle | null>(null);
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(999999);
  const [player, setPlayer] = useState<videojs.Player | null>(null);
  const [playing, setPlaying] = useState<VideoPlayerSource | null>(null);
  const {pId, time, isContinuous} = useQueryParams();
  const [query] = useSearchQuery();
  const [order] = useSearchOrder();
  const queryInput = useSubtitleQueryInput();
  const searchParams = buildSearchParams({query, order}); if(isContinuous) { searchParams.set('continuous', 'true'); }
  const buildPlayerTo = (s: Subtitle) => s ? `/recordings/player/${s.pId}?${searchParams}` : null
  const [fetch, { loading, error, data }] = useLazyQuery<{subtitle: Subtitle}>(GET_SUBTITLE, {
    variables: {
      pId: pId
    },
    onCompleted(data) {
      const s = data.subtitle;
      setPlaying({
        src: s.hdVideoUri ?? s.sdVideoUri ?? '',
        type: 'video/mp4'
      });
    }
  });

  useEffect(() => {
    if(pId !== null) {
      fetch()
        .then(_ => {
          if(isContinuous) {
            return fetchNextSubtitle(client, queryInput, pId);
          } else {
            return null;
          }
        })
        .then(s => {
          setNextSubtitle(s);
        });
    }
  }, [pId, isContinuous]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(nextSubtitle && timeRemainingSec < 1) {
      setTimeRemainingSec(999999);
      navigate(buildPlayerTo(nextSubtitle) ?? '', {replace: true});
    }
  }, [nextSubtitle, timeRemainingSec]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(player && playing) {
      player.src(playing);
    }
  }, [player, playing]);

  if(pId === null) {
    return (
      <Box className="player error">
        <QuestionMark className="icon" />
      </Box>
    );
  }

  const titles = safeNormalizeTitle(data?.subtitle ?? null);
  const forwardTime = (time: number) => {
    if(!player) {
      return;
    }
    const d = player.duration();
    let t = player.currentTime() + time;
    if(t < 0) t = 0;
    if(t > d) t = d;
    player.currentTime(t);
    player?.userActive(true);
  };
  const deferUserInactivation = (e: React.MouseEvent) => {
    player?.reportUserActivity(e.nativeEvent);
    player?.options({
      inactivityTimeout: 0
    });
  };
  const beginUserInactivation = () => {
    player?.options({
      inactivityTimeout
    });
  };
  const onReady = async (player: videojs.Player) => {
    setPlayer(player);
    player.one('canplay', () => {
      player.currentTime(time ?? 0);
      if(isIOS) {
        player.muted(false);
      }
    });
    player.on('play', () => {
      setState("playing");
      player?.userActive(true);
    });
    player.on('pause', () => {
      setState("stopped");
    });
    player.on('useractive', () => {
      setUserActive(true);
    });
    player.on('userinactive', () => {
      setUserActive(false);
    });
    player.on('timeupdate', function(this: videojs.Player) {
      const duration = this.duration();
      const time = this.currentTime();
      setTimeRemainingSec(duration - time);
    });
  };

  return (
    <>
      {loading || !data
      ? <Box className="recording-player player loading">
          <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open>
            <CircularProgress color="inherit"/>
          </Backdrop>
        </Box>
      : <></>}
      {error
      ? <Box className="recording-player player error">
          <Error className="icon" />
        </Box>
      : <></>}
      <Box
        className={[
          'recording-player', 'player', state,
          state === 'stopped' || isUserActive ? 'show-overlay' : '',
          timeRemainingSec < 15 ? 'show-next-video' : ''
        ].join(' ')}
        onMouseMove={(e: React.MouseEvent) => {
          if(isDesktop) {
            player?.reportUserActivity(e.nativeEvent);
          }
        }}
      >
        <ThemeProvider theme={headerTheme}>
          <Card className="subtitle-info">
            <AppTopHeader
              position="static"
              onMouseEnter={deferUserInactivation}
              onMouseLeave={beginUserInactivation}
            />
            <CardContent>
              <Typography variant="h1">{ titles.title }</Typography>
              <Typography variant="caption">{ titles.subtitle }</Typography>
            </CardContent>
          </Card>
        </ThemeProvider>
        <ThemeProvider theme={timeControlTheme}>
          <Box
            className="time-controls"
            onTouchStart={e => e.stopPropagation()}
            onMouseEnter={deferUserInactivation}
            onMouseLeave={beginUserInactivation}
          >
            <IconButton onClick={() => forwardTime(-15)}>
              <SvgIcon component={BackwardIcon} viewBox="6 6 20 20" sx={{ transform: 'scale(-1, 1)' }} />
              <Typography>15</Typography>
            </IconButton>
            <IconButton onClick={() => player?.pause()} style={{ display: state === 'playing' ? 'inline' : 'none' }}>
              <Pause />
            </IconButton>
            <IconButton onClick={() => player?.play()} style={{ display: state === 'stopped' ? 'inline' : 'none' }}>
              <PlayArrow />
            </IconButton>
            <IconButton onClick={() => forwardTime(15)} >
              <SvgIcon component={BackwardIcon} viewBox="6 6 20 20" />
              <Typography>15</Typography>
            </IconButton>
          </Box>
        </ThemeProvider>
        {(() => {
          if(!nextSubtitle) {
            return <></>;
          }
          const titles = normalizeTitle(nextSubtitle);
          return (
            <ThemeProvider theme={nextVideoTheme}>
              <Card
                className="next-video"
                onMouseEnter={deferUserInactivation}
                onMouseLeave={beginUserInactivation}
              >
                <CardHeader
                  title="次の動画"
                  subheader={<>
                    <Typography variant="body1">{ titles.title }</Typography>
                    <Typography variant="body2">{ titles.subtitle }</Typography>
                  </>}
                />
                <Link
                  className="thumbnail-container"
                  to={buildPlayerTo(nextSubtitle) ?? ''}
                  component={RouterLink}
                  replace
                >
                  <CardMedia
                    component="img"
                    className="thumbnail"
                    image={nextSubtitle.thumbnailUri ?? '/images/recorded/no-thumbnail-img.png'}
                    alt="thumbnail"
                  />
                  <PlayCircleOutline className="play-watermark" />
                </Link>
              </Card>
            </ThemeProvider>
          );
        })()}
        <VideoPlayer
          autoplay
          controls
          playsInline
          inactivityTimeout={inactivityTimeout}
          muted={isIOS}
          onReady={onReady}
          preload="metadata"
        />
      </Box>
    </>
  );
}
