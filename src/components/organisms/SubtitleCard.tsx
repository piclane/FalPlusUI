import {FileStatus, Subtitle, SubtitleUpdateInput} from "@/Model";
import {DateTime, Duration} from "luxon";
import {
  Card,
  CardContent,
  CardMedia,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography
} from "@mui/material";
import {Theme} from '@mui/material/styles';
import React, {useState} from "react";
import "./SubtitleCard.scss";
import {Link as RouterLink, To, useLocation, useNavigate} from "react-router-dom";
import {SxProps} from "@mui/system";
import {PlayCircleOutline, PlayDisabled, Videocam} from "@mui/icons-material";
import {normalizeTitle, TID_EPG, TID_KEYWORD} from "@/utils/SubtitleUtil";
import {resolvePath} from "react-router";
import {equalsPath} from "@/utils/RouteUtil";
import {buildClassNames} from "@/utils/NodeUtil";
import {STATUS_THEMES, ViewFileStatusType} from "@/Constants";
import {gql, useMutation} from "@apollo/client";

const UPDATE_SUBTITLE = gql`
  mutation UpdateSubtitle(
      $input: SubtitleUpdateInput!
  ) {
      updateSubtitle(input: $input) {
          pId
          fileStatus
      }
  }
`;

function statusView(status?: ViewFileStatusType | null | undefined) {
  const statusTheme = STATUS_THEMES[status ?? 'UNDEFINED'];
  return {
    text: statusTheme?.text ?? '不明',
    icon: React.cloneElement(statusTheme?.icon ?? <></>, {className: 'icon'})
  };
}

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

  const searchParams = new URLSearchParams(location.search);
  if(s.tId === TID_KEYWORD) {
    if (s.keywordGroups && s.keywordGroups.length) {
      return (
        <ul className="title keyword-groups">
          {s.keywordGroups.map(kg => {
            searchParams.set('mode', 'keyword');
            searchParams.set('keywordGroupId', `${kg.keywordGroupId}`);
            return (
              <li key={kg.keywordGroupId}>
                <TitleBody to={`?${searchParams}`} text={kg.keyword} />
              </li>
            );
          })}
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
    searchParams.set('mode', 'program');
    searchParams.set('tId', `${s.program.tId}`);
    return (
      <div className="title">
        <TitleBody to={`?${searchParams}`} text={titles.title} />
      </div>
    );
  }
};

const EditableStatus = ({subtitle: s}: {subtitle: Subtitle}) => {
  const availableOptions = ['RECEND', 'ALL_COMPLETE', 'TRANSCODE_FAILED'];
  const selectOptions = Object.entries(STATUS_THEMES).map(e => {
    return {value: e[0], available: availableOptions.includes(e[0]), ...e[1]};
  });
  const [status, setStatus] = useState<ViewFileStatusType>(s.fileStatus ?? 'UNDEFINED');
  const [updateSubtitle] = useMutation<{updateSubtitle: Subtitle}>(UPDATE_SUBTITLE);
  const handleStatusChanged = async (e: SelectChangeEvent<ViewFileStatusType>) => {
    const newStatus = e.target.value as FileStatus;
    const input: SubtitleUpdateInput = {
      pId: s.pId,
      fileStatus: newStatus
    };
    await updateSubtitle({
      variables: {
        input
      }
    });
    setStatus(newStatus);
  };

  return (
    <Select <ViewFileStatusType>
      value={status}
      variant="standard"
      onChange={handleStatusChanged}
      inputProps={{ sx: { paddingTop: 0, paddingBottom: 0 } }}
      renderValue={(selected) => {
        const view = statusView(selected);
        return (
          <div className="file-status" style={{ paddingLeft: '1em' }}>
            {view.icon}
            <span className="label">{view.text}</span>
          </div>
        );
      }}
    >
      {selectOptions.map(e => (
        <MenuItem key={e.value} value={e.value} sx={{ display: e.available ? 'flex' : 'none' }}>
          {e.icon}
          <Typography variant="button" sx={{ marginLeft: '0.2em' }}>{e.text}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export interface SubtitleCardProps {
  /** 表示する放送 */
  subtitle: Subtitle;

  /** 録画詳細モードで使用する場合 true */
  detail?: boolean;

  /** マウスカーソルがホバー状態の場合に、強調表示する場合 true */
  hover?: boolean;

  /** 少し小さめに表示する場合 true */
  mini?: boolean;

  /** CSS スタイルのオーバーライドを指定します */
  sx?: SxProps<Theme>;

  /** 追加のクラス名を指定します */
  className?: string;

  /** ボディー領域に表示する子ノード */
  children?: React.ReactNode;

  /** フッタ領域に表示する子ノード */
  footer?: React.ReactNode;
  playerPath?: (subtitle: Subtitle) => To;
}

export default function SubtitleCard(props: SubtitleCardProps) {
  const {subtitle: s, detail, mini, hover, sx, className, children, footer, playerPath} = props;
  const location = useLocation();
  const navigate = useNavigate();
  const startDateTime = DateTime.fromISO(s.startDateTime);
  const duration = Duration.fromISO(s.duration);
  const status = s.fileStatus ?? 'UNDEFINED';
  const videoUri = s.hdVideoUri ?? s.sdVideoUri ?? '';
  const detailHref = `/recordings/${s.pId}`;
  const playerTo = playerPath ? playerPath(s) : `/recordings/player/${s.pId}`;

  return (
    <Card className={buildClassNames({'subtitle-card': true, mini, hover, [className ?? '']: true})} variant="outlined" sx={sx}>
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
          {footer ?? <></>}
          <div className="spacer" />
          {detail
          ? <EditableStatus subtitle={s} />
          : (() => {
              const view = statusView(status);
              return (
                <div className="file-status">
                  <Tooltip title={view.text} arrow>
                    {view.icon}
                  </Tooltip>
                </div>
              );
            })()}
        </div>
      </CardContent>
    </Card>
  );
}
