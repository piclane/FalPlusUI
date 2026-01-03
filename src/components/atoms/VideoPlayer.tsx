import * as React from 'react';
import {useCallback, useRef} from 'react';
import videojs from 'video.js';
import {SourceObject} from 'video.js/dist/types/tech/tech';
import 'video.js/dist/video-js.css';
import './VideoPlayer.scss';
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import Player from 'video.js/dist/types/player';

export type RawVideoPlayerSource = SourceObject;

export type RawVideoPlayer = Player;

export interface VideoPlayerPropsInterface {
  playsInline?: boolean;
  onReady?: (player: RawVideoPlayer) => void;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

export default function VideoPlayer(props: VideoPlayerPropsInterface) {
  const playerRef = useRef<RawVideoPlayer | null>(null);

  const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
      const onReady = function(this: RawVideoPlayer) {
        if(props?.playsInline) {
          this.tech(true).setAttribute("playsInline", "playsInline");
        }
        props.onReady?.(this);
      };

      playerRef.current = videojs(node, props, onReady);
    } else {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box className="vjs-big-play-centered" sx={props.sx}>
      <div className="c-player__screen"  data-vjs-player="true">
        <video
          ref={videoRefCallback}
          className="video-js"
        />
      </div>
    </Box>
  );
}
