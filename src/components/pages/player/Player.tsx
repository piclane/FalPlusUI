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
  Link,
  ThemeProvider,
  Typography,
} from "@mui/material";
import "./Player.scss";
import {normalizeTitle, safeNormalizeTitle} from "@/utils/SubtitleUtil";
import {Error, PlayCircleOutline, QuestionMark} from "@mui/icons-material";
import {isDesktop, isMobile, isIOS} from 'react-device-detect';
import AppTopHeader from "@/components/atoms/AppTopHeader";
import {
  buildSearchParams,
  useSearchOrder,
  useSearchQuery,
  useSubtitleQueryInput
} from "@/components/pages/recording/list/SearchParams";

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
      }
    },
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

type PlayerState = "stopped" | "playing";

export default function Player() {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [state, setState] = useState<PlayerState>("stopped");
  const [mouseMoving, setMouseMoving] = useState<boolean>(true);
  const [mouseMovingTimerId, setMouseMovingTimerId] = useState<NodeJS.Timeout | null>(null);
  const [nextSubtitle, setNextSubtitle] = useState<Subtitle | null>(null);
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(999999);
  const [player, setPlayer] = useState<videojs.Player | null>(null);
  const [playing, setPlaying] = useState<VideoPlayerSource | null>(null);
  const {pId, time, isContinuous} = useQueryParams();
  const [query] = useSearchQuery();
  const [order] = useSearchOrder();
  const queryInput = useSubtitleQueryInput(query, order);
  const searchParams = buildSearchParams({query, order}); if(isContinuous) { searchParams.set('continuous', 'true'); }
  const buildPlayerTo = (s: Subtitle) => s ? `/player/${s.pId}?${searchParams}` : null
  const [fetch, { loading, error, data }] = useLazyQuery<{subtitle: Subtitle}>(GET_SUBTITLE, {
    variables: {
      pId: pId
    },
    onCompleted(data: {subtitle: Subtitle}) {
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
  const handleMouseMoving = () => {
    setMouseMoving(true);
    if (mouseMovingTimerId !== null) {
      clearTimeout(mouseMovingTimerId);
    }
    const timerId = setTimeout(() => {
      setMouseMoving(false);
    }, 2000);
    setMouseMovingTimerId(timerId);
  };
  const onReady = async (player: videojs.Player) => {
    setPlayer(player);
    player.one('canplay', _ => {
      player.currentTime(time ?? 0);
      if(isIOS) {
        player.muted(false);
      }
    });
    player.on('play', _ => {
      setState("playing");
      handleMouseMoving();
    });
    player.on('pause', _ => {
      setState("stopped");
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
      ? <Box className="player loading">
          <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open>
            <CircularProgress color="inherit"/>
          </Backdrop>
        </Box>
      : <></>}
      {error
      ? <Box className="player error">
          <Error className="icon" />
        </Box>
      : <></>}
      <Box
        className={[
          'player', state,
          state === 'stopped' || mouseMoving ? 'show-overlay' : '',
          timeRemainingSec < 15 ? 'show-next-video' : ''
        ].join(' ')}
        onMouseMove={() => {
          if(isDesktop) {
            handleMouseMoving();
          }
        }}
        onTouchStart={() => {
          if(isMobile) {
            if(mouseMoving) {
              setMouseMoving(false);
              if (mouseMovingTimerId !== null) {
                clearTimeout(mouseMovingTimerId);
              }
            } else {
              handleMouseMoving();
            }
          }
        }}
      >
        <ThemeProvider theme={headerTheme}>
          <Card className="subtitle-info">
            <AppTopHeader
              position="static"
            />
            <CardContent>
              <Typography sx={{
                fontSize: "3vmax",
                fontWeight: "bold",
                borderBottom: '1px solid rgba(255,255,255,.4)',
                marginBottom: "10px",
                paddingBottom: "5px",
              }}>{ titles.title }</Typography>
              <Typography sx={{
                fontSize: "1.3vmax"
              }}>{ titles.subtitle }</Typography>
            </CardContent>
          </Card>
        </ThemeProvider>
        {(() => {
          if(!nextSubtitle) {
            return <></>;
          }
          const titles = normalizeTitle(nextSubtitle);
          return (
            <ThemeProvider theme={nextVideoTheme}>
              <Card className="next-video">
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
          muted={isIOS}
          onReady={onReady}
          preload="metadata"
        />
      </Box>
    </>
  );
}
