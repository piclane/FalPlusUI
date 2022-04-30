import {Subtitle, VideoType} from "@/Model";

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
