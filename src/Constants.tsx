import {FileStatus, Subtitle, VideoType} from "@/Model";
import {Done, Error, HourglassBottom, HourglassTop, QuestionMark, Videocam} from "@mui/icons-material";
import React from "react";
import {CircularProgress} from "@mui/material";

interface VideoTypeTheme {
  videoType: VideoType;
  label: string;
  icon: string;

  /** Subtitle から動画 URI を取得する関数 */
  videoUri: (subtitle: Subtitle) => string | null;

  /** Subtitle から動画サイズを取得する関数 */
  videoSize: (subtitle: Subtitle) => number | null;
}

export const VIDEO_TYPES: Record<VideoType, VideoTypeTheme> = Object.freeze({
  TS: {
    videoType: 'TS',
    label: 'TS Video',
    icon: '/images/icon/ic_mpeg2.png',
    videoUri: (subtitle: Subtitle) => subtitle.tsVideoUri ?? null,
    videoSize: (subtitle: Subtitle) => subtitle.tsVideoSize ?? null,
  },
  SD: {
    videoType: 'SD',
    label: 'SD Video',
    icon: '/images/icon/ic_mp4SD.png',
    videoUri: (subtitle: Subtitle) => subtitle.sdVideoUri ?? null,
    videoSize: (subtitle: Subtitle) => subtitle.sdVideoSize ?? null,
  },
  HD: {
    videoType: 'HD',
    label: 'HD Video',
    icon: '/images/icon/ic_mp4HD.png',
    videoUri: (subtitle: Subtitle) => subtitle.hdVideoUri ?? null,
    videoSize: (subtitle: Subtitle) => subtitle.hdVideoSize ?? null,
  }
});

interface StatusTheme {
  /** ラベル */
  label: string;
  icon: React.ReactElement;
  cls?: string;
}

const progressIcon = () => (<CircularProgress size={12} color="inherit" />);

export type ViewFileStatusType = FileStatus | 'UNDEFINED';

export const STATUS_THEMES: Record<ViewFileStatusType, StatusTheme> = Object.freeze({
  RESERVING_LONG: {label: "予約中", icon: <HourglassTop />},
  RESERVING_SHORT: {label: "予約中(直前)", icon: <HourglassBottom />},
  RECORDING: {label: "録画中", cls: 'recording', icon: <Videocam sx={{color: 'red'}} />},
  REC_TS_SPLITTING: {label: "録画後ファイル分割中", icon: progressIcon()},
  RECEND: {label: "録画完了", cls: 'recording', icon: <Videocam sx={{color: '#600'}} />},
  WAITING_CAPTURE: {label: "キャプ作成待ち", cls: 'recording', icon: progressIcon()},
  CAPTURE: {label: "キャプ作成中", cls: 'recording', icon: progressIcon()},
  CAPEND: {label: "キャプ作成完了", cls: 'recording', icon: progressIcon()},
  THM_CREATE: {label: "サムネイル作成中", cls: 'recording', icon: progressIcon()},
  WAITING_TRANSCODE: {label: "MP4変換待ち", cls: 'recording', icon: progressIcon()},
  TRANSCODE_TS_SPLITTING: {label: "MP4変換中(スプリット)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_FFMPEG: {label: "MP4変換中(SD映像)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_WAVE: {label: "MP4変換中(音声抽出)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_AAC: {label: "MP4変換中(音声)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_MP4BOX: {label: "AAC作成完了", cls: 'recording', icon: progressIcon()},
  TRANSCODE_ATOM: {label: "MP4変換中(ヘッダ)", cls: 'recording', icon: progressIcon()},
  TRANSCODE_COMPLETE: {label: "MP4-SD変換完了", cls: 'recording', icon: progressIcon()},
  WAITING_HD_TRANSCODE: {label: "MP4-HD変換中", cls: 'recording', icon: progressIcon()},
  ALL_COMPLETE: {label: "完了", cls: 'success', icon: <Done sx={{color: '#00d300'}}/>},
  TRANSCODE_FAILED: {label: "変換不能(スキップ)", cls: 'fail', icon: <Error color="error" />},
  UNDEFINED: {label: "未定義", icon: <QuestionMark />}
});
