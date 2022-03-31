export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * デュレーション型
   * 例: PT8H6M12.345S
   */
  Duration: string;
  /**
   * ローカルな日付型
   * 例: 2020-06-04
   */
  LocalDate: string;
  /**
   * ローカル日時型 ISO-8601形式
   * 例: 2020-06-04T20:26:32
   */
  LocalDateTime: string;
  /** Long 型 */
  Long: number;
  /**
   * オフセット付き日時型 ISO-8601形式
   * 例: 2020-06-04T20:26:32+09:00
   */
  OffsetDateTime: string;
  /** URI 型 */
  URI: string;
  /** ファイルアップロード型 */
  Upload: any;
  /** Void 型 */
  Void: void;
}

/** CM カットに関する情報 */
export interface CmEdit {
  __typename?: 'CmEdit';
  /** CM カット閾値 */
  detectThreshold: CmEditDetectThreshold;
  /** CMカットルール TS */
  tsRule: CmEditRule;
  /** CMカットルール MP4 */
  mp4Rule: CmEditRule;
}

/** CM カット閾値 */
export type CmEditDetectThreshold =
  /** オフ */
  | 'OFF'
  /** 弱 */
  | 'LOW'
  /** 中 */
  | 'MEDIUM'
  /** 強 */
  | 'HIGH';

/** CM カットルール */
export type CmEditRule =
  /** 編集しない */
  | 'DO_NOTHING'
  /** 本編のみ (CMカット) */
  | 'DELETE_CM'
  /** CMのみ (本編カット) */
  | 'LEAVE_ONLY_CM'
  /** 本編+CM(同尺並べ替え) */
  | 'SORT_CM'
  /** チャプタ追加 */
  | 'ADD_CHAPTERS';

/** 放送動画削除入力 */
export interface DeleteSubtitleVideoInput {
  /** 放送ID */
  pId?: Maybe<Scalars['Int']>;
  /** 動画ファイルの種別 */
  videoTypes: Array<VideoType>;
  /** 物理削除の場合 true そうでない場合 false */
  physical?: Maybe<Scalars['Boolean']>;
}

/** 種別 */
export type DigitalStationBand =
  /** BS デジタル */
  | 'BS'
  /** CS デジタル */
  | 'CS'
  /** 地上波デジタル */
  | 'TERRESTRIAL'
  /** ラジオ */
  | 'RADIO'
  /** 未定義 */
  | 'UNDEFINED';

/** 昇順・降順 */
export type Direction =
  /** 昇順 */
  | 'Ascending'
  /** 降順 */
  | 'Descending';

/** ディスク情報 */
export interface DiskInfo {
  __typename?: 'DiskInfo';
  /** 総容量 (バイト) */
  totalBytes: Scalars['Long'];
  /** 使用可能容量 (バイト) */
  usableBytes: Scalars['Long'];
}

/** パケット識別子ごとのドロップ情報 */
export interface DropInfoDetail {
  __typename?: 'DropInfoDetail';
  /** パケット識別子 */
  pid?: Maybe<Scalars['Int']>;
  /** パケット数 */
  total: Scalars['Int'];
  /** ドロップしたパケット数 */
  drop: Scalars['Int'];
  /** スクランブルされているパケット数 */
  scrambling: Scalars['Int'];
}

/** ドロップ情報概要 */
export interface DropInfoSummary {
  __typename?: 'DropInfoSummary';
  /** 全パケット数 */
  totalSum: Scalars['Int'];
  /** 全ドロップしたパケット数 */
  dropSum: Scalars['Int'];
  /** 全スクランブルされているパケット数 */
  scramblingSum: Scalars['Int'];
}


/** ステータス */
export type FileStatus =
  /** 予約中(5分以上先) */
  | 'RESERVING_LONG'
  /** 予約中(5分以内) */
  | 'RESERVING_SHORT'
  /** 録画中 */
  | 'RECORDING'
  /** TSSplit中 */
  | 'REC_TS_SPLITTING'
  /** MPEG2録画終了 */
  | 'RECEND'
  /** 静止画キャプチャ待 */
  | 'WAITING_CAPTURE'
  /** 静止画キャプ中 */
  | 'CAPTURE'
  /** 静止画キャプ終了 */
  | 'CAPEND'
  /** サムネイル作成済み(.THM) */
  | 'THM_CREATE'
  /** トラコン待 */
  | 'WAITING_TRANSCODE'
  /** トラコン中:TSsplit */
  | 'TRANSCODE_TS_SPLITTING'
  /** トラコン中:H264 */
  | 'TRANSCODE_FFMPEG'
  /** トラコン中:WAVE */
  | 'TRANSCODE_WAVE'
  /** トラコン中:AAC */
  | 'TRANSCODE_AAC'
  /** トラコン中:MP4Box */
  | 'TRANSCODE_MP4BOX'
  /** トラコン中:ATOM */
  | 'TRANSCODE_ATOM'
  /** トラコン完了 */
  | 'TRANSCODE_COMPLETE'
  /** HDトラコン待機中 */
  | 'WAITING_HD_TRANSCODE'
  /** 全完了 */
  | 'ALL_COMPLETE'
  /** 変換不能 */
  | 'TRANSCODE_FAILED';

/** キーワードグループ */
export interface KeywordGroup {
  __typename?: 'KeywordGroup';
  /** キーワードグループ ID */
  keywordGroupId: Scalars['Int'];
  /** キーワード */
  keyword: Scalars['String'];
}

/** キーワードグループクエリ入力 */
export interface KeywordGroupQueryInput {
  /**
   * 録画が存在するキーワードグループを取得する場合 true
   * 録画が存在しないキーワードグループを取得する場合 false
   * 両方のキーワードグループを取得する場合 null
   */
  hasRecording?: Maybe<Scalars['Boolean']>;
  /** キーワード (部分一致) */
  keywordContains?: Maybe<Scalars['String']>;
}




export interface Mutation {
  __typename?: 'Mutation';
  /**
   * 放送を更新します
   * @param input 放送更新入力
   * @return 更新された放送
   */
  updateSubtitle: Subtitle;
  /**
   * 放送の動画ファイルをアップロードします
   * @param input 放送動画アップロード入力
   * @param video 動画ファイル
   */
  uploadSubtitleVideo: Subtitle;
  /**
   * 放送の動画ファイルを削除します
   * @param input 放送動画削除入力
   */
  deleteSubtitleVideo?: Maybe<Scalars['Void']>;
  /**
   * チャンネルを更新します
   * @param input チャンネル更新入力
   */
  updateStation?: Maybe<Station>;
  /** トランスコードを開始します */
  startTranscode?: Maybe<Scalars['Void']>;
}


export interface MutationUpdateSubtitleArgs {
  input: SubtitleUpdateInput;
}


export interface MutationUploadSubtitleVideoArgs {
  input: UploadSubtitleVideoInput;
  video: Scalars['Upload'];
}


export interface MutationDeleteSubtitleVideoArgs {
  input: Array<DeleteSubtitleVideoInput>;
}


export interface MutationUpdateStationArgs {
  input?: Maybe<StationUpdateInput>;
}


/** 番組 */
export interface Program {
  __typename?: 'Program';
  /** プライマリキー */
  tId: Scalars['Int'];
  /** タイトル */
  title: Scalars['String'];
  /** 番組開始時期 */
  firstLight?: Maybe<Scalars['LocalDate']>;
  /** アスペクト比 */
  aspect?: Maybe<Scalars['Int']>;
  /** タイトル (短縮) */
  shortTitle: Scalars['String'];
  /** タイトル (読み) */
  titleYomi: Scalars['String'];
  /** タイトル (英語) */
  titleEn: Scalars['String'];
}

/** 番組クエリ入力 */
export interface ProgramQueryInput {
  /** 番組開始時期の最小値 */
  firstLightAfter?: Maybe<Scalars['LocalDate']>;
  /** 番組開始時期の最大値 */
  firstLightBefore?: Maybe<Scalars['LocalDate']>;
  /** 番組タイトル (部分一致) */
  titleContains?: Maybe<Scalars['String']>;
  /**
   * 録画が存在する番組を取得する場合 true
   * 録画が存在しない番組を取得する場合 false
   * 両方の番組を取得する場合 null
   */
  hasRecording?: Maybe<Scalars['Boolean']>;
}

/** 番組取得結果 */
export interface ProgramResult {
  __typename?: 'ProgramResult';
  /** 検索の先頭からのオフセット */
  offset: Scalars['Int'];
  /** 検索結果の最大取得件数 */
  limit: Scalars['Int'];
  /** 総行数 */
  total: Scalars['Int'];
  /** ページのデータ */
  data: Array<Program>;
}

export interface Query {
  __typename?: 'Query';
  /** API のバージョンを取得します */
  version: Scalars['String'];
  /**
   * 放送を取得します
   *
   * @param pId 放送 ID
   */
  subtitle?: Maybe<Subtitle>;
  /**
   * 放送を取得します
   *
   * @param query クエリ
   * @param offset 検索の先頭からのオフセット
   * @param limit 検索結果の最大取得件数
   */
  subtitles: SubtitleResult;
  /**
   * 指定されたクエリにおける、指定された放送のオフセットを取得します
   *
   * @param query クエリ
   * @param pId 放送 IS
   */
  subtitleOffset?: Maybe<Scalars['Int']>;
  /**
   * 番組を取得します
   *
   * @param query クエリ
   * @param offset 検索の先頭からのオフセット
   * @param limit 検索結果の最大取得件数
   */
  programs: ProgramResult;
  /**
   * チャンネルを取得します
   *
   * @param query クエリ
   */
  stations: StationResult;
  /**
   * キーワードグループを取得します
   *
   * @param query クエリ
   */
  keywordGroups: Array<KeywordGroup>;
  /** ディスク情報を取得します */
  diskInfo: DiskInfo;
}


export interface QuerySubtitleArgs {
  pId: Scalars['Int'];
}


export interface QuerySubtitlesArgs {
  query?: Maybe<SubtitleQueryInput>;
  offset: Scalars['Int'];
  limit?: Scalars['Int'];
}


export interface QuerySubtitleOffsetArgs {
  query?: Maybe<SubtitleQueryInput>;
  pId: Scalars['Int'];
}


export interface QueryProgramsArgs {
  query?: Maybe<ProgramQueryInput>;
  offset: Scalars['Int'];
  limit?: Scalars['Int'];
}


export interface QueryStationsArgs {
  query?: Maybe<StationQueryInput>;
}


export interface QueryKeywordGroupsArgs {
  query?: Maybe<KeywordGroupQueryInput>;
}

/** 録画タイプ型 */
export type RecordingType =
  /** アニメ自動録画 */
  | 'Program'
  /** EPG 録画 */
  | 'Epg'
  /** キーワード録画 */
  | 'Keyword';

/** チャンネル */
export interface Station {
  __typename?: 'Station';
  /** チャンネルID */
  stationId: Scalars['Int'];
  /** 局名 */
  stationName: Scalars['String'];
  /** 不明 */
  stationCallSign?: Maybe<Scalars['String']>;
  /** 局の URL */
  stationUri?: Maybe<Scalars['String']>;
  /** ontvcode */
  ontvcode?: Maybe<Scalars['String']>;
  /** 物理チャンネル */
  digitalCh?: Maybe<Scalars['Int']>;
  /** 種別 */
  digitalStationBand?: Maybe<DigitalStationBand>;
  /** EPG 名 */
  epgName?: Maybe<Scalars['String']>;
  /** 受信可否 */
  receiving: Scalars['Boolean'];
  /** CM 検出閾値 */
  cmEditDetectThreshold?: Maybe<CmEditDetectThreshold>;
}

/** チャンネルクエリ入力 */
export interface StationQueryInput {
  /**
   * 受信可能なチャンネルのみを取得する場合 true
   * 受信不能なチャンネルのみを取得する場合 false
   * すべてのチャンネルを取得する場合 null
   */
  receivableStation?: Maybe<Scalars['Boolean']>;
}

/** チャンネル取得結果 */
export interface StationResult {
  __typename?: 'StationResult';
  /** 総行数 */
  total: Scalars['Int'];
  /** ページのデータ */
  data: Array<Station>;
}

/** チャンネル更新入力 */
export interface StationUpdateInput {
  /** チャンネルID */
  stationId: Scalars['Int'];
  /** 局名 */
  stationName?: Maybe<Scalars['String']>;
  /** ontvcode */
  ontvcode?: Maybe<Scalars['String']>;
  /** 物理チャンネル */
  digitalCh?: Maybe<Scalars['Int']>;
  /** 受信可否 */
  receiving?: Maybe<Scalars['Boolean']>;
  /** CM 検出閾値 */
  cmEditDetectThreshold?: Maybe<CmEditDetectThreshold>;
}

/** 放送 */
export interface Subtitle {
  __typename?: 'Subtitle';
  /** 放送ID */
  pId: Scalars['Int'];
  /** 番組ID (foltia_program.tid に連結) */
  tId: Scalars['Int'];
  /** チャンネルID (foltia_station.stationid に連結) */
  stationId: Scalars['Int'];
  /** 話数 */
  countNo?: Maybe<Scalars['Int']>;
  /** サブタイトル */
  subtitle?: Maybe<Scalars['String']>;
  /** 放送開始日時 */
  startDateTime: Scalars['LocalDateTime'];
  /** 放送終了日時 */
  endDateTime: Scalars['LocalDateTime'];
  /** 開始時刻オフセット (秒) */
  startOffset: Scalars['Int'];
  /** 放映尺 (分) */
  lengthMin: Scalars['Int'];
  /** TS のファイル名 */
  m2pFilename?: Maybe<Scalars['String']>;
  /** SD 動画ファイル名 */
  pspFilename?: Maybe<Scalars['String']>;
  /** EPG 録画の場合、登録したユーザID そうでない場合 NULL */
  epgAddedBy?: Maybe<Scalars['Int']>;
  /** 最終更新日時 */
  lastUpdate?: Maybe<Scalars['OffsetDateTime']>;
  /** ステータス */
  fileStatus?: Maybe<FileStatus>;
  /** アスペクト比 */
  aspect?: Maybe<Scalars['Int']>;
  /** トランスコード品質 */
  encodeSetting?: Maybe<TranscodeQuality>;
  /** HD 動画ファイル名 */
  mp4hd?: Maybe<Scalars['String']>;
  /** しょぼいカレンダーフラグ */
  syobocalFlag: Array<SyobocalFlag>;
  /** しょぼいカレンダー修正回数 */
  syobocalRev?: Maybe<Scalars['Int']>;
  /** 録画タイプ */
  recordingType: RecordingType;
  /** 放映尺 */
  duration: Scalars['Duration'];
  /** チャンネル */
  station: Station;
  /** 番組 */
  program: Program;
  /** すべてのキーワードグループ */
  keywordGroups?: Maybe<Array<KeywordGroup>>;
  /** TS 動画ファイルへの URI */
  tsVideoUri?: Maybe<Scalars['URI']>;
  /** SD 動画ファイルへの URI */
  sdVideoUri?: Maybe<Scalars['URI']>;
  /** HD 動画ファイルへの URI */
  hdVideoUri?: Maybe<Scalars['URI']>;
  /** ドロップ情報概要 */
  dropInfoSummary?: Maybe<DropInfoSummary>;
  /** パケット識別子ごとのドロップ情報 */
  dropInfoDetail?: Maybe<Array<DropInfoDetail>>;
  /** サムネイルの URI */
  thumbnailUri?: Maybe<Scalars['URI']>;
  /** 動画全体のサムネイルの URI */
  thumbnailUris?: Maybe<Array<Scalars['URI']>>;
  /** CM カット情報 */
  cmEdit: CmEdit;
}

/** 放送クエリ入力 */
export interface SubtitleQueryInput {
  /** 番組ID */
  tId?: Maybe<Scalars['Int']>;
  /** 録画タイプ */
  recordingTypes?: Maybe<Array<RecordingType>>;
  /**
   * 受信可能なチャンネルの放送のみを取得する場合 true
   * 受信不能なチャンネルの放送のみを取得する場合 false
   * すべての放送を取得する場合 null
   */
  receivableStation?: Maybe<Scalars['Boolean']>;
  /**
   * 録画が存在する放送を取得する場合 true
   * 録画が存在しない放送を取得する場合 false
   * 両方の放送を取得する場合 null
   */
  hasRecording?: Maybe<Scalars['Boolean']>;
  /**
   * hasRecording=true の場合に、録画中の放送を「録画が存在する」とみなす場合 true
   * そうでない場合 false もしくは null
   */
  nowRecording?: Maybe<Scalars['Boolean']>;
  /** キーワードグループID */
  keywordGroupId?: Maybe<Scalars['Int']>;
  /** サブタイトル (部分一致) */
  subtitleContains?: Maybe<Scalars['String']>;
  /** ソート方向 */
  direction?: Maybe<Direction>;
}

/** 放送取得結果 */
export interface SubtitleResult {
  __typename?: 'SubtitleResult';
  /** 検索の先頭からのオフセット */
  offset: Scalars['Int'];
  /** 検索結果の最大取得件数 */
  limit: Scalars['Int'];
  /** 総行数 */
  total: Scalars['Int'];
  /** ページのデータ */
  data: Array<Subtitle>;
}

/** 放送更新入力 */
export interface SubtitleUpdateInput {
  /** 放送ID */
  pId: Scalars['Int'];
  /** サブタイトル */
  subtitle?: Maybe<Scalars['String']>;
  /** TS のファイル名 */
  m2pFilename?: Maybe<Scalars['String']>;
  /** SD 動画ファイル名 */
  pspFilename?: Maybe<Scalars['String']>;
  /** ステータス */
  fileStatus?: Maybe<FileStatus>;
  /** トランスコード品質 */
  encodeSetting?: Maybe<TranscodeQuality>;
  /** HD 動画ファイル名 */
  mp4hd?: Maybe<Scalars['String']>;
}

/**
 * しょぼいカレンダーフラグ
 * https://docs.cal.syoboi.jp/spec/proginfo-flag/
 */
export type SyobocalFlag =
  /** 注 */
  | 'Attention'
  /** 新番組 */
  | 'New'
  /** 最終回 */
  | 'End'
  /** 再放送 */
  | 'Rerun';

/** トランスコード品質 */
export type TranscodeQuality =
  /** 変換しない */
  | 'NONE'
  /** SD のみ */
  | 'SD'
  /** HD */
  | 'HD'
  /** SD + HD */
  | 'BOTH';



/** 放送動画アップロード入力 */
export interface UploadSubtitleVideoInput {
  /** 放送ID */
  pId?: Maybe<Scalars['Int']>;
  /** 動画ファイルの種別 */
  videoType: VideoType;
}

/** 動画ファイルの種別を表現します */
export type VideoType =
  /** 録画ファイル */
  | 'TS'
  /** SD 画質 */
  | 'SD'
  /** HD 画質 */
  | 'HD';

