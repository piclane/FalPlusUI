import {FileStatus, Subtitle} from "@/Model";
import {DateTime, Duration} from "luxon";
import {Card, CardContent, CardMedia, CircularProgress, Link, Tooltip} from "@mui/material";
import {Theme} from '@mui/material/styles';
import React from "react";
import "./SubtitleCard.scss";
import {Link as RouterLink, To, useLocation, useNavigate} from "react-router-dom";
import {SxProps} from "@mui/system";
import {
  Done,
  Error,
  HourglassBottom,
  HourglassTop,
  PlayCircleOutline,
  PlayDisabled,
  Videocam
} from "@mui/icons-material";
import {normalizeTitle, TID_EPG, TID_KEYWORD} from "@/utils/SubtitleUtil";
import {resolvePath} from "react-router";
import {equalsPath} from "@/utils/RouteUtil";

interface StatusTheme {
  text: string;
  icon?: React.ReactElement;
  cls?: string;
}

const progressIcon = () => (<CircularProgress size={12} color="inherit" />);
const statusThemes: Record<(FileStatus | 'UNDEFINED'), StatusTheme> = Object.freeze({
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
  UNDEFINED: {text: "未定義"}
});


const Title = ({subtitle: s}: {subtitle: Subtitle}) => {
  const titles = normalizeTitle(s);
  const location = useLocation();
  const TitleBody = ({to, text}: {to: string | null; text: string}) => {
    if(!to || equalsPath(resolvePath(to), location)) {
      return <>{ text }</>;
    }
    return (
      <Link to={to} underline="hover" color="inherit" component={RouterLink}>
        {text}
      </Link>
    )
  };

  if(s.tId === TID_KEYWORD) {
    if (s.keywordGroups && s.keywordGroups.length) {
      return (
        <ul className="title keyword-groups">
          {s.keywordGroups.map(kg => (
            <li key={kg.keywordGroupId}>
              <TitleBody to={`/recordings?mode=keyword&keywordGroupId=${kg.keywordGroupId}`} text={kg.keyword} />
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="title">
          <TitleBody to={null} text="キーワード録画" />
        </div>
      );
    }
  } if(s.tId === TID_EPG) {
    return (
      <div className="title">
        <TitleBody to={null} text={titles.title} />
      </div>
    );
  } else {
    return (
      <div className="title">
        <TitleBody to={`/recordings?mode=program&tId=${s.program.tId}`} text={titles.title} />
      </div>
    );
  }
};

export default function SubtitleCard({subtitle: s, detail, hover, sx, className, children, playerPath}: {
  subtitle: Subtitle;
  detail?: boolean;
  hover?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  children?: React.ReactNode;
  playerPath?: (subtitle: Subtitle) => To;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const startDateTime = DateTime.fromISO(s.startDateTime);
  const duration = Duration.fromISO(s.duration);
  const status = s.fileStatus ?? 'UNDEFINED';
  const statusTheme = statusThemes[status];
  const statusIcon = React.cloneElement(statusTheme?.icon ?? <></>, {className: 'icon'});
  const statusText = statusTheme?.text ?? '不明';
  const videoUri = s.hdVideoUri ?? s.sdVideoUri ?? '';
  const detailHref = `/recordings/${s.pId}`;
  const playerTo = playerPath ? playerPath(s) : `/player/${s.pId}`;

  return (
    <Card className={`subtitle-card ${statusTheme.cls ?? ''} ${hover ? 'hover' : ''} ${className ?? ''}`} variant="outlined" sx={sx}>
      <Link to={playerTo} underline="none" className="thumbnail-container" component={RouterLink}>
        <CardMedia
          component="img"
          className="thumbnail"
          image={s.fileStatus === 'RECORDING'
            ? 'data:image/gif;base64,R0lGODdhAQABAIABAAAAAP///ywAAAAAAQABAAACAkQBADs='
            : (s.thumbnailUri ?? '/images/recorded/no-thumbnail-img.png')
          }
          loading="lazy"
          alt="thumbnail" />
        {s.fileStatus === 'RECORDING'
          ? <Videocam className="play-watermark always" />
          : videoUri
            ? <PlayCircleOutline className="play-watermark" />
            : <PlayDisabled className="play-watermark disabled" />
        }
        <span className="duration">{duration.toHuman()}</span>
      </Link>
      <CardContent
        className="details"
        sx={{ cursor: detail ? 'default' : 'pointer' }}
        onClick={(e) => {
          if(e.target instanceof HTMLAnchorElement || detail) {
            return;
          }
          navigate(detailHref);
        }}
      >
        <div className="title-bar">
          <Title subtitle={s}/>
          <div className="station">{s.station.stationName}</div>
        </div>
        <div className="subtitle">
          {equalsPath(resolvePath(detailHref), location)
          ? <>{normalizeTitle(s).subtitle}</>
          : <Link to={detailHref} underline="none" color="inherit" component={RouterLink}>
              {normalizeTitle(s).subtitle}
            </Link>
          }
        </div>
        {children}
        <div className="spacer" />
        <div className="footer">
          <div className="start-date-time">{startDateTime.toFormat('yyyy/MM/dd(EEE) HH:mm:ss', {locale: 'ja'})}</div>
          <div className="spacer" />
          <div className="file-status">
          {detail
          ? <>
              {statusIcon}
              <span className="label">{statusText}</span>
            </>
          : <Tooltip title={statusTheme?.text ?? '不明'} arrow>
              {statusIcon}
            </Tooltip>
          }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
