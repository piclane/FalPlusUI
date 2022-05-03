import {Dispatch, useMemo} from "react";
import {useSearchParams} from "react-router-dom";
import {isNumber, safeParseInt} from "@/utils/TypeUtil";
import {Direction, FileStatus, Maybe, VideoType, RecordingType, SubtitleQueryInput} from "@/Model";

/**
 * 動画種別の使用可否を指定します
 *
 * @param videoTypes 元となる動画種別の配列
 * @param videoType 使用可否を指定する動画種別
 * @param enabled 使用可否
 */
export function toggleVideoType(videoTypes: VideoType[] | null | undefined, videoType: VideoType, enabled: boolean): VideoType[] {
  if(!videoTypes) {
    videoTypes = [];
  } else {
    videoTypes = videoTypes.filter(vt => vt !== videoType);
  }
  if(enabled) {
    videoTypes = [...videoTypes, videoType];
    videoTypes.sort();
  }
  return videoTypes;
}

/**
 * 検索に含まれる動画種別を取得・設定するフック
 */
export function useSearchVideoTypes(): readonly [VideoType[], Dispatch<VideoType[]>] {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo<VideoType[]>(() => {
    const videoTypes = searchParams.get('vt');
    if(!videoTypes) {
      return [];
    }
    return videoTypes.split(',').map(s => {
      const t = s.trim().toUpperCase();
      switch(t) {
        case 'TS':
        case 'SD':
        case 'HD':
          return t;
        default:
          return null;
      }
    }).filter(s => !!s) as VideoType[];
  }, [searchParams]);
  const setQuery = (videoTypes: VideoType[]) => {
    setSearchParams(buildSearchParams({videoTypes, searchParams}));
  };
  return [query, setQuery];
}

/**
 * 検索クエリ型
 */
export type SearchQuery = {
  mode: 'program';
  tId?: number | null;
} | {
  mode: 'keyword';
  keywordGroupId?: number | null;
} | {
  mode: 'epg';
} | null;

/**
 * 検索クエリを取得・設定するフック
 */
export function useSearchQuery(): readonly [SearchQuery, Dispatch<SearchQuery>] {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo<SearchQuery>(() => {
    const mode = searchParams.get('mode');
    switch(mode) {
      case 'program': return {mode, tId: safeParseInt(searchParams.get('tId'))};
      case 'keyword': return {mode, keywordGroupId: safeParseInt(searchParams.get('keywordGroupId'))};
      case 'epg':     return {mode};
      default:        return null;
    }
  }, [searchParams]);
  const setQuery = (query: SearchQuery) => {
    setSearchParams(buildSearchParams({query, searchParams}));
  };
  return [query, setQuery];
}

export interface SearchOrderMutations {
  setDirection: Dispatch<Direction>;
  toggleDirection: () => void;
}

/**
 * 検索ソート型
 */
export interface SearchOrder {
  /** ソート方向 */
  direction: Direction;
}

/**
 * 検索ソートを取得・設定するフック
 */
export function useSearchOrder(): readonly [SearchOrder, SearchOrderMutations] {
  const [searchParams, setSearchParams] = useSearchParams();
  const order = useMemo<SearchOrder>(() => {
    const dir = searchParams.get('dir');
    if(dir === 'asc') {
      return {
        direction: 'Ascending'
      };
    } else {
      return {
        direction: 'Descending'
      };
    }
  }, [searchParams]);
  const setDirection = (direction: Direction) => {
    const newOrder = {
      ...order,
      direction
    };
    setSearchParams(buildSearchParams({order: newOrder, searchParams}), {
      replace: true
    });
  };
  const toggleDirection = () => {
    setDirection(order.direction === 'Ascending' ? 'Descending' : 'Ascending');
  };
  return [order, {setDirection, toggleDirection}];
}

/** SubtitleQueryInput を生成するためのプロパティー */
export interface UseSubtitleQueryInputProps {
  /** nowRecording を含める場合 true そうでない場合 false */
  includeNowRecording?: boolean;

  /** ステータスを指定します */
  fileStatuses?: FileStatus[];
}

/**
 * 現在の検索パラメータかた SubtitleQueryInput を取得するフック
 *
 * @param props SubtitleQueryInput を生成するためのプロパティー
 */
export function useSubtitleQueryInput(props?: UseSubtitleQueryInputProps): SubtitleQueryInput {
  const {includeNowRecording = true, fileStatuses} = props ?? {};
  const [query] = useSearchQuery();
  const [order] = useSearchOrder();
  const [videoTypes] = useSearchVideoTypes();
  const modesToRecTypes = (modes: Array<Maybe<string>>): RecordingType[] => modes
    .map(mode => {
      switch(mode) {
        case 'program': return 'Program';
        case 'keyword': return 'Keyword';
        case 'epg':     return 'Epg';
        default:        return null;
      }
    })
    .filter((rt): rt is RecordingType => rt !== null);
  return useMemo(() => ({
    hasRecording: videoTypes.length === 0 ? true : undefined,
    nowRecording: includeNowRecording,
    tId: query?.mode === 'program' ? query.tId : null,
    keywordGroupId: query?.mode === 'keyword' ? query.keywordGroupId : null,
    recordingTypes: modesToRecTypes([query?.mode ?? null]),
    direction: order.direction,
    videoTypes: videoTypes.length === 0 ? undefined : videoTypes,
    fileStatuses,
  }), [query, order, videoTypes]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * buildSearchParams のプロパティー
 */
export interface BuildSearchParamsProps {
  /** 検索クエリ */
  query?: SearchQuery;

  /** 検索ソート */
  order?: SearchOrder;

  /** 検索動画種別 */
  videoTypes?: VideoType[];

  /** 指定された場合、この URLSearchParams を更新します */
  searchParams?: URLSearchParams;
}

/**
 * 検索クエリ・検索ソート・検索動画種別から URLSearchParams を生成します
 *
 * @param query 検索クエリ
 * @param order 検索ソート
 * @param videoTypes 検索動画種別
 * @param searchParams 指定された場合、この URLSearchParams を更新します
 */
export function buildSearchParams({query, order, videoTypes, searchParams}: BuildSearchParamsProps) {
  if(searchParams === undefined) {
    searchParams = new URLSearchParams();
  }
  if(query !== undefined) {
    searchParams.delete('keywordGroupId');
    searchParams.delete('tId');
    if(query) {
      searchParams.set('mode', query.mode);
      switch(query.mode) {
        case 'program':
          if(isNumber(query.tId)) {
            searchParams.set('tId', `${query.tId}`);
          }
          break;
        case 'keyword':
          if(isNumber(query.keywordGroupId)) {
            searchParams.set('keywordGroupId', `${query.keywordGroupId}`);
          }
          break;
      }
    } else {
      searchParams.delete('mode');
    }
  }
  if(order !== undefined) {
    if(order.direction === 'Ascending') {
      searchParams.set('dir', 'asc');
    } else {
      searchParams.delete('dir');
    }
  }
  if(videoTypes !== undefined) {
    if(videoTypes !== null && videoTypes.length) {
      searchParams.set('vt', videoTypes.join(','));
    } else {
      searchParams.delete('vt');
    }
  }
  return searchParams;
}
