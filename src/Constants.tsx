import {FileStatus, Subtitle, VideoType} from "@/Model";
import {Done, Error, HourglassBottom, HourglassTop, QuestionMark, Videocam} from "@mui/icons-material";
import React from "react";
import {CircularProgress} from "@mui/material";

interface VideoTypeTheme {
  /** 動画種別 */
  videoType: VideoType;

  /**ラベル */
  label: string;

  /** アイコン */
  icon: string;

  /** Subtitle から動画 URI を取得する関数 */
  videoUri: (subtitle: Subtitle) => string | null;

  /** Subtitle から動画サイズを取得する関数 */
  videoSize: (subtitle: Subtitle) => number | null;
}

/**
 * 動画種別ごとの定数
 */
export const VIDEO_TYPE_THEMES: Record<VideoType, VideoTypeTheme> = Object.freeze({
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

interface FileStatusTheme {
  /** ファイルステータステーマ */
  status: FileStatusThemeType;

  /** ラベル */
  label: string;

  /** アイコン */
  icon: React.ReactElement;

  /** クラス */
  cls?: string;
}

const progressIcon = () => (<CircularProgress size={12} color="inherit" />);

/** 表示用ファイルステータス型 */
export type FileStatusThemeType = FileStatus | 'UNDEFINED';

/**
 * ファイルステータスごとの定数
 */
export const FILE_STATUS_THEMES: Record<FileStatusThemeType, FileStatusTheme> = Object.freeze({
  RESERVING_LONG: {
    status: 'RESERVING_LONG',
    label: "予約中",
    icon: <HourglassTop/>
  },
  RESERVING_SHORT: {
    status: 'RESERVING_SHORT',
    label: "予約中(直前)",
    icon: <HourglassBottom/>
  },
  RECORDING: {
    status: 'RECORDING',
    label: "録画中",
    cls: 'recording',
    icon: <Videocam sx={{color: 'red'}}/>
  },
  REC_TS_SPLITTING: {
    status: 'REC_TS_SPLITTING',
    label: "録画後ファイル分割中",
    icon: progressIcon()
  },
  RECEND: {
    status: 'RECEND',
    label: "録画完了",
    cls: 'recording',
    icon: <Videocam sx={{color: '#600'}}/>
  },
  WAITING_CAPTURE: {
    status: 'WAITING_CAPTURE',
    label: "キャプ作成待ち",
    cls: 'recording',
    icon: progressIcon()
  },
  CAPTURE: {
    status: 'CAPTURE',
    label: "キャプ作成中",
    cls: 'recording',
    icon: progressIcon()
  },
  CAPEND: {
    status: 'CAPEND',
    label: "キャプ作成完了",
    cls: 'recording',
    icon: progressIcon()
  },
  THM_CREATE: {
    status: 'THM_CREATE',
    label: "サムネイル作成中",
    cls: 'recording',
    icon: progressIcon()
  },
  WAITING_TRANSCODE: {
    status: 'WAITING_TRANSCODE',
    label: "MP4変換待ち",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_TS_SPLITTING: {
    status: 'TRANSCODE_TS_SPLITTING',
    label: "MP4変換中(スプリット)",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_FFMPEG: {
    status: 'TRANSCODE_FFMPEG',
    label: "MP4変換中(SD映像)",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_WAVE: {
    status: 'TRANSCODE_WAVE',
    label: "MP4変換中(音声抽出)",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_AAC: {
    status: 'TRANSCODE_AAC',
    label: "MP4変換中(音声)",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_MP4BOX: {
    status: 'TRANSCODE_MP4BOX',
    label: "AAC作成完了",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_ATOM: {
    status: 'TRANSCODE_ATOM',
    label: "MP4変換中(ヘッダ)",
    cls: 'recording',
    icon: progressIcon()
  },
  TRANSCODE_COMPLETE: {
    status: 'TRANSCODE_COMPLETE',
    label: "MP4-SD変換完了",
    cls: 'recording',
    icon: progressIcon()
  },
  WAITING_HD_TRANSCODE: {
    status: 'WAITING_HD_TRANSCODE',
    label: "MP4-HD変換中",
    cls: 'recording',
    icon: progressIcon()
  },
  ALL_COMPLETE: {
    status: 'ALL_COMPLETE',
    label: "完了",
    cls: 'success',
    icon: <Done sx={{color: '#00d300'}}/>
  },
  TRANSCODE_FAILED: {
    status: 'TRANSCODE_FAILED',
    label: "変換不能(スキップ)",
    cls: 'fail',
    icon: <Error color="error"/>
  },
  UNDEFINED: {
    status: 'UNDEFINED',
    label: "未定義",
    icon: <QuestionMark/>
  }
});

/**
 * ファイルステータスのテーマを取得します
 *
 * @param fileStatus ファイルステータス
 * @param options オプション
 * @param options.iconProps アイコンのプロパティー
 */
export function fileStatusTheme(fileStatus: FileStatus | FileStatusThemeType | null | undefined, options?: {
  iconProps?: Partial<any> & React.Attributes
}): FileStatusTheme {
  const theme = FILE_STATUS_THEMES[fileStatus ?? 'UNDEFINED'];
  if(options?.iconProps) {
    return {
      ...theme,
      icon: React.cloneElement(theme.icon, options.iconProps)
    }
  }
  return theme;
}
