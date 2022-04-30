import {gql, useLazyQuery} from "@apollo/client";
import React, {useEffect, useImperativeHandle, useState} from "react";
import {Subtitle, SubtitleQueryInput, SubtitleResult} from "@/Model";
import {Backdrop, Box, CircularProgress} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import {ThreeDots} from "react-loader-spinner";
import {isNumber} from "@/utils/TypeUtil";

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
                tsVideoSize
                sdVideoSize
                hdVideoSize
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

export type SetTotalCallback = (total: number) => void;

export interface InfiniteSubtitlesProps {
  limit?: number;
  setTotal?: SetTotalCallback,
  query: SubtitleQueryInput;
  render: (subtitles: Subtitle[]) => React.ReactNode
}

export interface InfiniteSubtitlesMethods {
  refresh(): void;
}

const InfiniteSubtitles = React.forwardRef<InfiniteSubtitlesMethods, InfiniteSubtitlesProps>((
  {limit = 30, query, setTotal: setTotalCallback, render}: InfiniteSubtitlesProps,
  ref
) => {
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [fetch, {loading, error}] = useLazyQuery<{subtitles: SubtitleResult}>(FIND_SUBTITLES, {
    notifyOnNetworkStatusChange: true,
    onCompleted(result) {
      setTotal(result.subtitles.total);
      setSubtitles(prev => [...prev, ...result.subtitles.data]);
    },
  });
  const refresh = () => {
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
  };
  useEffect(() => {
    refresh();
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
  useEffect(() => {
    if(setTotalCallback && isNumber(total)) {
      setTotalCallback(total);
    }
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => ({
    refresh() {
      refresh();
    }
  }));

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
});

export default InfiniteSubtitles;
