export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  /** Job 型 */
  Job: string;
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
  /** CMカットルール MP4 */
  mp4Rule: CmEditRule;
  /** CMカットルール TS */
  tsRule: CmEditRule;
}

/** CM カット閾値 */
export type CmEditDetectThreshold =
  /** 強 */
  | 'HIGH'
  /** 弱 */
  | 'LOW'
  /** 中 */
  | 'MEDIUM'
  /** オフ */
  | 'OFF';

/** CM カットルール */
export type CmEditRule =
  /** チャプタ追加 */
  | 'ADD_CHAPTERS'
  /** 本編のみ (CMカット) */
  | 'DELETE_CM'
  /** 編集しない */
  | 'DO_NOTHING'
  /** CMのみ (本編カット) */
  | 'LEAVE_ONLY_CM'
  /** 本編+CM(同尺並べ替え) */
  | 'SORT_CM';

/** 放送動画削除入力 */
export interface DeleteSubtitleVideoInput {
  /** 放送ID */
  pId?: InputMaybe<Scalars['Int']>;
  /** 動画ファイルの種別 */
  videoTypes: Array<VideoType>;
}

/** 種別 */
export type DigitalStationBand =
  /** BS デジタル */
  | 'BS'
  /** CS デジタル */
  | 'CS'
  /** ラジオ */
  | 'RADIO'
  /** 地上波デジタル */
  | 'TERRESTRIAL'
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
  /** ドロップしたパケット数 */
  drop: Scalars['Int'];
  /** パケット識別子 */
  pid?: Maybe<Scalars['Int']>;
  /** スクランブルされているパケット数 */
  scrambling: Scalars['Int'];
  /** パケット数 */
  total: Scalars['Int'];
}

/** ドロップ情報概要 */
export interface DropInfoSummary {
  __typename?: 'DropInfoSummary';
  /** 全ドロップしたパケット数 */
  dropSum: Scalars['Int'];
  /** 全スクランブルされているパケット数 */
  scramblingSum: Scalars['Int'];
  /** 全パケット数 */
  totalSum: Scalars['Int'];
}

/** EPG */
export interface Epg {
  __typename?: 'Epg';
  /** カテゴリ */
  category: EpgCategory;
  /** 説明 */
  description: Scalars['String'];
  /** 終了日時 */
  endDateTime: Scalars['LocalDateTime'];
  /** EPG ID */
  epgId: Scalars['Long'];
  /** onTvChannel (onTvCode) */
  onTvChannel: Scalars['String'];
  /** 開始日時 */
  startDateTime: Scalars['LocalDateTime'];
  /** 番組名 */
  title: Scalars['String'];
}

/** EPG カテゴリー */
export type EpgCategory =
  /** アニメ・特撮 */
  | 'ANIME'
  /** 映画 */
  | 'CINEMA'
  /** ドキュメンタリー・教養 */
  | 'DOCUMENTARY'
  /** ドラマ */
  | 'DRAMA'
  /** 教育 */
  | 'EDUCATION'
  /** その他 */
  | 'ETC'
  /** 趣味・実用 */
  | 'HOBBY'
  /** 情報 */
  | 'INFORMATION'
  /** キッズ */
  | 'KIDS'
  /** 音楽 */
  | 'MUSIC'
  /** ニュース・報道 */
  | 'NEWS'
  /** スポーツ */
  | 'SPORTS'
  /** 演劇 */
  | 'STAGE'
  /** バラエティ */
  | 'VARIETY';

/** EPG クエリ入力 */
export interface EpgQueryInput {
  /** 指定された日時より後に終わる */
  endAfter?: InputMaybe<Scalars['LocalDateTime']>;
  /** 指定された日時より前に終わる */
  endBefore?: InputMaybe<Scalars['LocalDateTime']>;
  /** 指定された日時より後に始まる */
  startAfter?: InputMaybe<Scalars['LocalDateTime']>;
  /** 指定された日時より前に始まる */
  startBefore?: InputMaybe<Scalars['LocalDateTime']>;
}

/** ステータス */
export type FileStatus =
  /** 全完了 */
  | 'ALL_COMPLETE'
  /** 静止画キャプ終了 */
  | 'CAPEND'
  /** 静止画キャプ中 */
  | 'CAPTURE'
  /** MPEG2録画終了 */
  | 'RECEND'
  /** 録画中 */
  | 'RECORDING'
  /** TSSplit中 */
  | 'REC_TS_SPLITTING'
  /** 予約中(5分以上先) */
  | 'RESERVING_LONG'
  /** 予約中(5分以内) */
  | 'RESERVING_SHORT'
  /** サムネイル作成済み(.THM) */
  | 'THM_CREATE'
  /** トラコン中:AAC */
  | 'TRANSCODE_AAC'
  /** トラコン中:ATOM */
  | 'TRANSCODE_ATOM'
  /** トラコン完了 */
  | 'TRANSCODE_COMPLETE'
  /** 変換不能 */
  | 'TRANSCODE_FAILED'
  /** トラコン中:H264 */
  | 'TRANSCODE_FFMPEG'
  /** トラコン中:MP4Box */
  | 'TRANSCODE_MP4BOX'
  /** トラコン中:TSsplit */
  | 'TRANSCODE_TS_SPLITTING'
  /** トラコン中:WAVE */
  | 'TRANSCODE_WAVE'
  /** 静止画キャプチャ待 */
  | 'WAITING_CAPTURE'
  /** HDトラコン待機中 */
  | 'WAITING_HD_TRANSCODE'
  /** トラコン待 */
  | 'WAITING_TRANSCODE';

/** キーワードグループ */
export interface KeywordGroup {
  __typename?: 'KeywordGroup';
  /** キーワード */
  keyword: Scalars['String'];
  /** キーワードグループ ID */
  keywordGroupId: Scalars['Int'];
}

/** キーワードグループクエリ入力 */
export interface KeywordGroupQueryInput {
  /**
   * 録画が存在するキーワードグループを取得する場合 true
   * 録画が存在しないキーワードグループを取得する場合 false
   * 両方のキーワードグループを取得する場合 null
   * videoTypes と同時に指定された場合の挙動は未定義です。
   */
  hasRecording?: InputMaybe<Scalars['Boolean']>;
  /** キーワード (部分一致) */
  keywordContains?: InputMaybe<Scalars['String']>;
  /**
   * 動画ファイル種別
   * 指定された動画ファイル種別の内、いずれかの種別が存在する場合に、その放送が一致するとみなされます。
   * 空の配列が渡された場合および無指定の場合は、このフィルタは無視されます。
   * hasRecording と同時に指定された場合の挙動は未定義です。
   */
  videoTypes?: InputMaybe<Array<VideoType>>;
}

export type LiveQuality =
  /**
   * Audio: bitRate=48Kbps samplingRate=32.0KHz
   * Video: bitRate=110Kbps size=400x224 frameRate=9.99fps gop=30
   */
  | 'Q1'
  /**
   * Audio: bitRate=48Kbps samplingRate=32.0KHz
   * Video: bitRate=200Kbps size=400x224 frameRate=14.985fps gop=45
   */
  | 'Q2'
  /**
   * Audio: bitRate=96Kbps samplingRate=32.0KHz
   * Video: bitRate=400Kbps size=400x224 frameRate=29.97fps gop=90
   */
  | 'Q3'
  /**
   * Audio: bitRate=128Kbps samplingRate=32.0KHz
   * Video: bitRate=600Kbps size=640x360 frameRate=29.97fps gop=90
   */
  | 'Q4'
  /**
   * Audio: bitRate=128Kbps samplingRate=32.0KHz
   * Video: bitRate=760Kbps size=640x360 frameRate=29.97fps gop=90
   */
  | 'Q5'
  /**
   * Audio: bitRate=128Kbps samplingRate=44.1KHz
   * Video: bitRate=1168Kbps size=640x360 frameRate=29.97fps gop=90
   */
  | 'Q6'
  /**
   * Audio: bitRate=128Kbps samplingRate=44.1KHz
   * Video: bitRate=1800Kbps size=960x540 frameRate=29.97fps gop=90
   */
  | 'Q7'
  /**
   * Audio: bitRate=128Kbps samplingRate=44.1KHz
   * Video: bitRate=2000Kbps size=1024x576 frameRate=29.97fps gop=90
   */
  | 'Q8'
  /**
   * Audio: bitRate=160Kbps samplingRate=44.1KHz
   * Video: bitRate=2500Kbps size=1280x720 frameRate=29.97fps gop=90
   */
  | 'Q9'
  /**
   * Audio: bitRate=256Kbps samplingRate=44.1KHz
   * Video: bitRate=4500Kbps size=1280x720 frameRate=29.97fps gop=90
   */
  | 'Q10';

export interface LiveResult {
  __typename?: 'LiveResult';
  /** ライブID */
  liveId: Scalars['String'];
  /** m3u8 ファイルへの URI */
  m3u8Uri: Scalars['URI'];
  /** 推奨バッファ時間 */
  preferredBufferTime: Scalars['Duration'];
}

export interface Mutation {
  __typename?: 'Mutation';
  /**
   * 放送の動画ファイルを削除します
   *
   * @param input 放送動画削除入力
   */
  deleteSubtitleVideo: Scalars['Job'];
  /**
   * クエリに一致した動画ファイルを削除します。
   * 削除する動画ファイルの種別は SubtitleQueryInput.videoTypes で指定します。
   * SubtitleQueryInput.videoTypes の指定が無い又は空配列の場合、この処理は 0 を戻して即終了します。
   *
   * @param input 放送クエリ入力
   * @param physical 物理削除の場合 true そうでない場合 false
   * @return 削除した動画ファイルの件数
   */
  deleteSubtitleVideoByQuery: Scalars['Job'];
  /**
   * 指定されたチャンネルのライブを開始します
   *
   * @param stationId チャンネルID
   * @param liveQuality ライブ品質
   */
  startLive?: Maybe<LiveResult>;
  /** トランスコードを開始します */
  startTranscode?: Maybe<Scalars['Void']>;
  /**
   * ライブを停止します
   *
   * @param liveId ライブID
   */
  stopLive?: Maybe<Scalars['Void']>;
  /** すべてのライブを停止します */
  stopLiveAll?: Maybe<Scalars['Void']>;
  /**
   * チャンネルを更新します
   *
   * @param input チャンネル更新入力
   */
  updateStation?: Maybe<Station>;
  /**
   * 放送を更新します
   *
   * @param input 放送更新入力
   * @return 更新された放送
   */
  updateSubtitle: Subtitle;
  /**
   * 放送の動画ファイルをアップロードします
   *
   * @param input 放送動画アップロード入力
   * @param video 動画ファイル
   */
  uploadSubtitleVideo: Subtitle;
}


export interface MutationDeleteSubtitleVideoArgs {
  input: Array<DeleteSubtitleVideoInput>;
  physical?: Scalars['Boolean'];
}


export interface MutationDeleteSubtitleVideoByQueryArgs {
  input: SubtitleQueryInput;
  physical?: Scalars['Boolean'];
}


export interface MutationStartLiveArgs {
  liveQuality: LiveQuality;
  stationId: Scalars['Long'];
}


export interface MutationStopLiveArgs {
  liveId: Scalars['String'];
}


export interface MutationUpdateStationArgs {
  input?: InputMaybe<StationUpdateInput>;
}


export interface MutationUpdateSubtitleArgs {
  input: SubtitleUpdateInput;
}


export interface MutationUploadSubtitleVideoArgs {
  input: UploadSubtitleVideoInput;
  video: Scalars['Upload'];
}

/** 番組 */
export interface Program {
  __typename?: 'Program';
  /** アスペクト比 */
  aspect?: Maybe<Scalars['Int']>;
  /** 番組開始時期 */
  firstLight?: Maybe<Scalars['LocalDate']>;
  /** タイトル (短縮) */
  shortTitle: Scalars['String'];
  /** プライマリキー */
  tId: Scalars['Int'];
  /** タイトル */
  title: Scalars['String'];
  /** タイトル (英語) */
  titleEn: Scalars['String'];
  /** タイトル (読み) */
  titleYomi: Scalars['String'];
}

/** 番組クエリ入力 */
export interface ProgramQueryInput {
  /** 番組開始時期の最小値 */
  firstLightAfter?: InputMaybe<Scalars['LocalDate']>;
  /** 番組開始時期の最大値 */
  firstLightBefore?: InputMaybe<Scalars['LocalDate']>;
  /**
   * 録画が存在する番組を取得する場合 true
   * 録画が存在しない番組を取得する場合 false
   * 両方の番組を取得する場合 null
   * videoTypes と同時に指定された場合の挙動は未定義です。
   */
  hasRecording?: InputMaybe<Scalars['Boolean']>;
  /** 番組タイトル (部分一致) */
  titleContains?: InputMaybe<Scalars['String']>;
  /**
   * 動画ファイル種別
   * 指定された動画ファイル種別の内、いずれかの種別が存在する場合に、その放送が一致するとみなされます。
   * 空の配列が渡された場合および無指定の場合は、このフィルタは無視されます。
   * hasRecording と同時に指定された場合の挙動は未定義です。
   */
  videoTypes?: InputMaybe<Array<VideoType>>;
}

/** 番組取得結果 */
export interface ProgramResult {
  __typename?: 'ProgramResult';
  /** 任意のコンテキストデータ */
  contextData?: Maybe<Scalars['String']>;
  /** ページのデータ */
  data: Array<Program>;
  /** 検索結果の最大取得件数 */
  limit: Scalars['Int'];
  /** 検索の先頭からのオフセット */
  offset: Scalars['Int'];
  /** 総行数 */
  total: Scalars['Int'];
}

export interface Query {
  __typename?: 'Query';
  /** ディスク情報を取得します */
  diskInfo: DiskInfo;
  /**
   * ライブのバッファされている秒数を取得します
   *
   * @param liveId ライブID
   */
  getLiveDuration: Scalars['Duration'];
  /** ジョブの進捗を0〜1の間で取得します */
  jobProgress?: Maybe<Scalars['Float']>;
  /**
   * キーワードグループを取得します
   *
   * @param query クエリ
   */
  keywordGroups: Array<KeywordGroup>;
  /**
   * 番組を取得します
   *
   * @param query クエリ
   * @param offset 検索の先頭からのオフセット
   * @param limit 検索結果の最大取得件数
   * @param contextData 任意のコンテキストデータ
   */
  programs: ProgramResult;
  /**
   * チャンネルを取得します
   *
   * @param query クエリ
   */
  stations: StationResult;
  /**
   * 放送を取得します
   *
   * @param pId 放送 ID
   */
  subtitle?: Maybe<Subtitle>;
  /**
   * 指定されたクエリにおける、指定された放送のオフセットを取得します
   *
   * @param query クエリ
   * @param pId 放送 ID
   */
  subtitleOffset?: Maybe<Scalars['Int']>;
  /**
   * 放送を取得します
   *
   * @param query クエリ
   * @param offset 検索の先頭からのオフセット
   * @param limit 検索結果の最大取得件数
   * @param contextData 任意のコンテキストデータ
   */
  subtitles: SubtitleResult;
  /** API のバージョンを取得します */
  version: Scalars['String'];
}


export interface QueryGetLiveDurationArgs {
  liveId: Scalars['String'];
}


export interface QueryJobProgressArgs {
  job: Scalars['Job'];
}


export interface QueryKeywordGroupsArgs {
  query?: InputMaybe<KeywordGroupQueryInput>;
}


export interface QueryProgramsArgs {
  contextData?: InputMaybe<Scalars['String']>;
  limit?: Scalars['Int'];
  offset: Scalars['Int'];
  query?: InputMaybe<ProgramQueryInput>;
}


export interface QueryStationsArgs {
  query?: InputMaybe<StationQueryInput>;
}


export interface QuerySubtitleArgs {
  pId: Scalars['Int'];
}


export interface QuerySubtitleOffsetArgs {
  pId: Scalars['Int'];
  query?: InputMaybe<SubtitleQueryInput>;
}


export interface QuerySubtitlesArgs {
  contextData?: InputMaybe<Scalars['String']>;
  limit?: Scalars['Int'];
  offset: Scalars['Int'];
  query?: InputMaybe<SubtitleQueryInput>;
}

/** 録画タイプ型 */
export type RecordingType =
  /** EPG 録画 */
  | 'Epg'
  /** キーワード録画 */
  | 'Keyword'
  /** アニメ自動録画 */
  | 'Program';

/** チャンネル */
export interface Station {
  __typename?: 'Station';
  /** CM 検出閾値 */
  cmEditDetectThreshold?: Maybe<CmEditDetectThreshold>;
  /** 物理チャンネル */
  digitalCh?: Maybe<Scalars['Int']>;
  /** 種別 */
  digitalStationBand?: Maybe<DigitalStationBand>;
  /** EPG 番組 */
  epg: Array<Epg>;
  /** EPG 名 */
  epgName?: Maybe<Scalars['String']>;
  /** 放送中の EPG 番組 */
  epgNow?: Maybe<Epg>;
  /** ontvcode */
  ontvcode?: Maybe<Scalars['String']>;
  /** 受信可否 */
  receiving: Scalars['Boolean'];
  /** 不明 */
  stationCallSign?: Maybe<Scalars['String']>;
  /** チャンネルID */
  stationId: Scalars['Int'];
  /** 局名 */
  stationName: Scalars['String'];
  /** 局の URL */
  stationUri?: Maybe<Scalars['String']>;
}


/** チャンネル */
export interface StationEpgArgs {
  query?: InputMaybe<EpgQueryInput>;
}

/** チャンネルクエリ入力 */
export interface StationQueryInput {
  /** チャンネル種別 */
  digitalStationBands?: InputMaybe<Array<DigitalStationBand>>;
  /**
   * 受信可能なチャンネルのみを取得する場合 true
   * 受信不能なチャンネルのみを取得する場合 false
   * すべてのチャンネルを取得する場合 null
   */
  receivableStation?: InputMaybe<Scalars['Boolean']>;
}

/** チャンネル取得結果 */
export interface StationResult {
  __typename?: 'StationResult';
  /** ページのデータ */
  data: Array<Station>;
  /** 総行数 */
  total: Scalars['Int'];
}

/** チャンネル更新入力 */
export interface StationUpdateInput {
  /** CM 検出閾値 */
  cmEditDetectThreshold?: InputMaybe<CmEditDetectThreshold>;
  /** 物理チャンネル */
  digitalCh?: InputMaybe<Scalars['Int']>;
  /** ontvcode */
  ontvcode?: InputMaybe<Scalars['String']>;
  /** 受信可否 */
  receiving?: InputMaybe<Scalars['Boolean']>;
  /** チャンネルID */
  stationId: Scalars['Int'];
  /** 局名 */
  stationName?: InputMaybe<Scalars['String']>;
}

/** 放送 */
export interface Subtitle {
  __typename?: 'Subtitle';
  /** アスペクト比 */
  aspect?: Maybe<Scalars['Int']>;
  /** CM カット情報 */
  cmEdit: CmEdit;
  /** 話数 */
  countNo?: Maybe<Scalars['Int']>;
  /** パケット識別子ごとのドロップ情報 */
  dropInfoDetail?: Maybe<Array<DropInfoDetail>>;
  /** ドロップ情報概要 */
  dropInfoSummary?: Maybe<DropInfoSummary>;
  /** 放映尺 */
  duration: Scalars['Duration'];
  /** トランスコード品質 */
  encodeSetting?: Maybe<TranscodeQuality>;
  /** 放送終了日時 */
  endDateTime: Scalars['LocalDateTime'];
  /** EPG 録画の場合、登録したユーザID そうでない場合 NULL */
  epgAddedBy?: Maybe<Scalars['Int']>;
  /** ステータス */
  fileStatus?: Maybe<FileStatus>;
  /** HD 動画の容量 (バイト) */
  hdVideoSize?: Maybe<Scalars['Long']>;
  /** HD 動画ファイルへの URI */
  hdVideoUri?: Maybe<Scalars['URI']>;
  /** すべてのキーワードグループ */
  keywordGroups?: Maybe<Array<KeywordGroup>>;
  /** 最終更新日時 */
  lastUpdate?: Maybe<Scalars['OffsetDateTime']>;
  /** 放映尺 (分) */
  lengthMin: Scalars['Int'];
  /** TS のファイル名 */
  m2pFilename?: Maybe<Scalars['String']>;
  /** HD 動画ファイル名 */
  mp4hd?: Maybe<Scalars['String']>;
  /** 放送ID */
  pId: Scalars['Int'];
  /** 番組 */
  program: Program;
  /** SD 動画ファイル名 */
  pspFilename?: Maybe<Scalars['String']>;
  /** 録画タイプ */
  recordingType: RecordingType;
  /** SD 動画の容量 (バイト) */
  sdVideoSize?: Maybe<Scalars['Long']>;
  /** SD 動画ファイルへの URI */
  sdVideoUri?: Maybe<Scalars['URI']>;
  /** 放送開始日時 */
  startDateTime: Scalars['LocalDateTime'];
  /** 開始時刻オフセット (秒) */
  startOffset: Scalars['Int'];
  /** チャンネル */
  station: Station;
  /** チャンネルID (foltia_station.stationid に連結) */
  stationId: Scalars['Int'];
  /** サブタイトル */
  subtitle?: Maybe<Scalars['String']>;
  /** しょぼいカレンダーフラグ */
  syobocalFlag: Array<SyobocalFlag>;
  /** しょぼいカレンダー修正回数 */
  syobocalRev?: Maybe<Scalars['Int']>;
  /** 番組ID (foltia_program.tid に連結) */
  tId: Scalars['Int'];
  /** サムネイルの URI */
  thumbnailUri?: Maybe<Scalars['URI']>;
  /** 動画全体のサムネイルの URI */
  thumbnailUris?: Maybe<Array<Scalars['URI']>>;
  /** TS 動画の容量 (バイト) */
  tsVideoSize?: Maybe<Scalars['Long']>;
  /** TS 動画ファイルへの URI */
  tsVideoUri?: Maybe<Scalars['URI']>;
}

/** 放送クエリ入力 */
export interface SubtitleQueryInput {
  /** ソート方向 */
  direction?: InputMaybe<Direction>;
  /**
   * ステータス
   * 指定されたステータスを含む放送のみを取得します
   */
  fileStatuses?: InputMaybe<Array<FileStatus>>;
  /**
   * 動画ファイル種別のうち、いずれかの録画が存在する放送を取得する場合 true
   * いずれの種別の録画も存在しない放送を取得する場合 false
   * 両方の放送を取得する場合 null
   * videoTypes と同時に指定された場合の挙動は未定義です。
   */
  hasRecording?: InputMaybe<Scalars['Boolean']>;
  /** キーワードグループID */
  keywordGroupId?: InputMaybe<Scalars['Int']>;
  /**
   * hasRecording = true や videoTypes.isNotEmpty の場合に、録画中の放送を「録画が存在する」とみなす場合 true
   * そうでない場合 false もしくは null
   */
  nowRecording?: InputMaybe<Scalars['Boolean']>;
  /**
   * 受信可能なチャンネルの放送のみを取得する場合 true
   * 受信不能なチャンネルの放送のみを取得する場合 false
   * すべての放送を取得する場合 null
   */
  receivableStation?: InputMaybe<Scalars['Boolean']>;
  /** 録画タイプ */
  recordingTypes?: InputMaybe<Array<RecordingType>>;
  /** サブタイトル (部分一致) */
  subtitleContains?: InputMaybe<Scalars['String']>;
  /** 番組ID */
  tId?: InputMaybe<Scalars['Int']>;
  /**
   * 動画ファイル種別
   * 指定された動画ファイル種別の内、いずれかの種別が存在する場合に、その放送が一致するとみなされます。
   * 空の配列が渡された場合および無指定の場合は、このフィルタは無視されます。
   * hasRecording と同時に指定された場合の挙動は未定義です。
   */
  videoTypes?: InputMaybe<Array<VideoType>>;
}

/** 放送取得結果 */
export interface SubtitleResult {
  __typename?: 'SubtitleResult';
  /** 任意のコンテキストデータ */
  contextData?: Maybe<Scalars['String']>;
  /** ページのデータ */
  data: Array<Subtitle>;
  /** 検索結果の最大取得件数 */
  limit: Scalars['Int'];
  /** 検索の先頭からのオフセット */
  offset: Scalars['Int'];
  /** 総行数 */
  total: Scalars['Int'];
}

/** 放送更新入力 */
export interface SubtitleUpdateInput {
  /** トランスコード品質 */
  encodeSetting?: InputMaybe<TranscodeQuality>;
  /** ステータス */
  fileStatus?: InputMaybe<FileStatus>;
  /** TS のファイル名 */
  m2pFilename?: InputMaybe<Scalars['String']>;
  /** HD 動画ファイル名 */
  mp4hd?: InputMaybe<Scalars['String']>;
  /** 放送ID */
  pId: Scalars['Int'];
  /** SD 動画ファイル名 */
  pspFilename?: InputMaybe<Scalars['String']>;
  /** サブタイトル */
  subtitle?: InputMaybe<Scalars['String']>;
}

/**
 * しょぼいカレンダーフラグ
 * https://docs.cal.syoboi.jp/spec/proginfo-flag/
 */
export type SyobocalFlag =
  /** 注 */
  | 'Attention'
  /** 最終回 */
  | 'End'
  /** 新番組 */
  | 'New'
  /** 再放送 */
  | 'Rerun';

/** トランスコード品質 */
export type TranscodeQuality =
  /** SD + HD */
  | 'BOTH'
  /** HD */
  | 'HD'
  /** 変換しない */
  | 'NONE'
  /** SD のみ */
  | 'SD';

/** 放送動画アップロード入力 */
export interface UploadSubtitleVideoInput {
  /** 放送ID */
  pId?: InputMaybe<Scalars['Int']>;
  /** 動画ファイルの種別 */
  videoType: VideoType;
}

/** 動画ファイルの種別を表現します */
export type VideoType =
  /** HD 画質 */
  | 'HD'
  /** SD 画質 */
  | 'SD'
  /** 録画ファイル */
  | 'TS';
