import {FileStatus, Subtitle, VideoType} from "@/Model";
import {Done, Error, HourglassBottom, HourglassTop, QuestionMark, Videocam} from "@mui/icons-material";
import React from "react";
import {CircularProgress} from "@mui/material";

export const VIDEO_TYPES = Object.freeze({
  TS: {
    videoType: 'TS',
    name: 'TS Video',
    icon: '/images/icon/ic_mpeg2.png',
    videoUri: (subtitle: Subtitle) => subtitle.tsVideoUri ?? null,
    videoSize: (subtitle: Subtitle) => subtitle.tsVideoSize ?? null,
  },
  SD: {
    videoType: 'SD',
    name: 'SD Video',
    icon: '/images/icon/ic_mp4SD.png',
    videoUri: (subtitle: Subtitle) => subtitle.sdVideoUri ?? null,
    videoSize: (subtitle: Subtitle) => subtitle.sdVideoSize ?? null,
  },
  HD: {
    videoType: 'HD',
    name: 'HD Video',
    icon: '/images/icon/ic_mp4HD.png',
    videoUri: (subtitle: Subtitle) => subtitle.hdVideoUri ?? null,
    videoSize: (subtitle: Subtitle) => subtitle.hdVideoSize ?? null,
  }
}) as Record<VideoType, {
  videoType: VideoType;
  name: string;
  icon: string;
  videoUri: (subtitle: Subtitle) => string | null;
  videoSize: (subtitle: Subtitle) => number | null;
}>;

interface StatusTheme {
  text: string;
  icon: React.ReactElement;
  cls?: string;
}

const progressIcon = () => (<CircularProgress size={12} color="inherit" />);

export type ViewFileStatusType = FileStatus | 'UNDEFINED';

export const STATUS_THEMES: Record<ViewFileStatusType, StatusTheme> = Object.freeze({
  RESERVING_LONG: {text: "予約中", icon: <HourglassTop />},
  RESERVING_SHORT: {text: "予約中(直前)", icon: <HourglassBottom />},
  RECORDING: {text: "録画中", cls: 'recording', icon: <Videocam sx={{color: 'red'}} />},
  REC_TS_SPLITTING: {text: "録画後ファイル分割中", icon: progressIcon()},
  RECEND: {text: "録画完了", cls: 'recording', icon: <Videocam sx={{color: '#600'}} />},
  WAITING_CAPTURE: {text: "キャプ作成待ち", cls: 'recording', icon: progressIcon()},
  CAPTURE: {text: "キャプ作成中", cls: 'recording', icon: progressIcon()},
  CAPEND: {text: "キャプ作成完了", cls: 'recording', icon: progressIcon()},
  THM_CREATE: {text: "サムネイル作成中", cls: 'recording', icon: progressIcon()},
  WAITING_TRANSCODE: {text: "MP4変換待ち", cls: 'recording', icon: progressIcon()},
  TRANSCODE_TS_SPLITTING: {text: "MP4変換中(スプリット)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_FFMPEG: {text: "MP4変換中(SD映像)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_WAVE: {text: "MP4変換中(音声抽出)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_AAC: {text: "MP4変換中(音声)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_MP4BOX: {text: "AAC作成完了", cls: 'recording', icon: progressIcon()},
  TRANSCODE_ATOM: {text: "MP4変換中(ヘッダ)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_COMPLETE: {text: "MP4-SD変換完了", cls: 'recording', icon: progressIcon()},
  WAITING_HD_TRANSCODE: {text: "MP4-HD変換中", cls: 'recording', icon: progressIcon()},
  ALL_COMPLETE: {text: "完了", cls: 'success', icon: <Done sx={{color: '#00d300'}}/>},
  TRANSCODE_FAILED: {text: "変換不能(スキップ)", cls: 'fail', icon: <Error color="error" />},
  UNDEFINED: {text: "未定義", icon: <QuestionMark />}
});
