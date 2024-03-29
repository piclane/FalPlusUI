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
import {Link as RouterLink, To, useLocation, useNavigate, resolvePath} from "react-router-dom";
import {SxProps} from "@mui/system";
import {PlayCircleOutline, PlayDisabled, Videocam} from "@mui/icons-material";
import {normalizeTitle, TID_EPG, TID_KEYWORD} from "@/utils/SubtitleUtil";
import {equalsPath} from "@/utils/RouteUtil";
import {buildClassNames as _BCN} from "@/utils/NodeUtil";
import {FILE_STATUS_THEMES, fileStatusTheme, FileStatusThemeType} from "@/Constants";
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
  const selectOptions = Object.entries(FILE_STATUS_THEMES).map(e => {
    return {value: e[0], available: availableOptions.includes(e[0]), ...e[1]};
  });
  const [status, setStatus] = useState<FileStatusThemeType>(s.fileStatus ?? 'UNDEFINED');
  const [updateSubtitle] = useMutation<{updateSubtitle: Subtitle}>(UPDATE_SUBTITLE);
  const handleStatusChanged = async (e: SelectChangeEvent<FileStatusThemeType>) => {
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
    <Select <FileStatusThemeType>
      value={status}
      variant="standard"
      onChange={handleStatusChanged}
      inputProps={{ sx: { paddingTop: 0, paddingBottom: 0 } }}
      renderValue={(selected) => {
        const fst = fileStatusTheme(selected, {iconProps: {className: 'icon'}});
        return (
          <div className="file-status" style={{ paddingLeft: '0.5em' }}>
            {fst.icon}
            <span className="label">{fst.label}</span>
          </div>
        );
      }}
    >
      {selectOptions.map(e => (
        <MenuItem key={e.value} value={e.value} sx={{ display: e.available ? 'flex' : 'none' }}>
          {e.icon}
          <Typography variant="button" sx={{ marginLeft: '0.2em' }}>{e.label}</Typography>
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
  const fst = fileStatusTheme(s.fileStatus, {iconProps: {className: 'icon'}});
  const videoUri = s.hdVideoUri ?? s.sdVideoUri ?? '';
  const detailHref = `/recordings/${s.pId}`;
  const playerTo = playerPath ? playerPath(s) : `/recordings/player/${s.pId}`;

  return (
    <Card className={_BCN('subtitle-card', className, fst.cls, {mini, hover})} variant="outlined" sx={sx}>
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
              return (
                <div className="file-status">
                  <Tooltip title={fst.label} arrow>
                    {fst.icon}
                  </Tooltip>
                </div>
              );
            })()}
        </div>
      </CardContent>
    </Card>
  );
}
