import {gql, useLazyQuery} from "@apollo/client";
import React, {useEffect, useState} from "react";
import {Subtitle, SubtitleQueryInput, SubtitleResult} from "@/Model";
import {Backdrop, Box, CircularProgress} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import {ThreeDots} from "react-loader-spinner";

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

export default function InfiniteSubtitles({limit = 30, query, render}: {
  limit?: number;
  query: SubtitleQueryInput;
  render: (subtitles: Subtitle[]) => React.ReactNode
}) {
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [fetch, {loading, error}] = useLazyQuery<{subtitles: SubtitleResult}>(FIND_SUBTITLES, {
    onCompleted(result) {
      setTotal(result.subtitles.total);
      setSubtitles(prev => [...prev, ...result.subtitles.data]);
    },
  });
  useEffect(() => {
    setSubtitles([]);
    setTotal(null);
    if(offset === 0) {
      fetch({
        variables: {
          query,
          offset: offset,
          limit: limit
        }
      });
    } else {
      setOffset(0);
    }
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetch({
      variables: {
        query,
        offset: offset,
        limit: limit
      }
    });
  }, [offset]); // eslint-disable-line react-hooks/exhaustive-deps

  if(error) {
    return <div>Error</div>
  }
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && offset === 0}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <InfiniteScroll
        next={() => setOffset(prev => prev + limit)}
        hasMore={(total ?? 0) > subtitles.length}
        loader={offset === 0
          ? <></>
          : <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '10px'}}>
              <ThreeDots color="primary" />
            </Box>
        }
        dataLength={subtitles.length}
        scrollThreshold={1}
        style={{ overflow: 'unset' }}
      >
        {render(subtitles)}
      </InfiniteScroll>
    </>
  );
};
