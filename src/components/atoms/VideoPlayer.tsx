import * as React from 'react';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.scss';
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {createRef, useEffect, useRef, useState} from "react";

export interface VideoPlayerOptions extends VideoJsPlayerOptions {
  playsInline?: boolean;
}

export interface VideoPlayerPropsInterface {
  options?: VideoPlayerOptions;
  onReady?: videojs.ReadyCallback;
  sx?: SxProps<Theme>;
}

export default function VideoPlayer(props: VideoPlayerPropsInterface) {
  const videoNodeRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    const player = videojs(videoNodeRef.current!, props.options, props.onReady);
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  const videoProps = {
    playsInline: props.options?.playsInline ?? false
  };

  return (
    <Box className="vjs-big-play-centered" sx={props.sx}>
      <div className="c-player__screen"  data-vjs-player="true">
        <video
          // @ts-ignore
          ref={videoNodeRef}
          className="video-js"
          {...videoProps}
        />
      </div>
    </Box>
  );
}
