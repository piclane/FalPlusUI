import * as React from 'react';
import {useEffect, useRef} from 'react';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.scss';
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

export type VideoPlayerSource = videojs.Tech.SourceObject;

export interface VideoPlayerPropsInterface extends VideoJsPlayerOptions {
  playsInline?: boolean;
  onReady?: (player: videojs.Player) => void;
  sx?: SxProps<Theme>;
}

export default function VideoPlayer(props: VideoPlayerPropsInterface) {
  const videoElementRef = useRef<HTMLVideoElement>();
  const onReady: videojs.ReadyCallback = function(this: videojs.Player) {
    if(props?.playsInline) {
      this.tech('thisIsSafe').setAttribute("playsInline", "playsInline");
    }
    props.onReady?.(this);
  };

  useEffect(() => {
    const player = videojs(videoElementRef.current!, props, onReady);
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box className="vjs-big-play-centered" sx={props.sx}>
      <div className="c-player__screen"  data-vjs-player="true">
        <video
          // @ts-ignore
          ref={videoElementRef}
          className="video-js"
        />
      </div>
    </Box>
  );
}
