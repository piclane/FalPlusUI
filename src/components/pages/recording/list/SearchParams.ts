import {Dispatch, useMemo} from "react";
import {useSearchParams} from "react-router-dom";
import {isNumber, safeParseInt} from "@/utils/TypeUtil";
import {Direction, Maybe, RecordingType, SubtitleQueryInput} from "@/Model";

export type SearchQuery = {
  mode: 'program';
  tId?: number | null;
} | {
  mode: 'keyword';
  keywordGroupId?: number | null;
} | {
  mode: 'epg';
} | null;

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
    setSearchParams(buildSearchParams({query}, searchParams));
  };
  return [query, setQuery];
}

export interface SearchOrderMutations {
  setDirection: Dispatch<Direction>;
  toggleDirection: () => void;
}

export interface SearchOrder {
  direction: Direction;
}

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
    setSearchParams(buildSearchParams({order: newOrder}, searchParams), {
      replace: true
    });
  };
  const toggleDirection = () => {
    setDirection(order.direction === 'Ascending' ? 'Descending' : 'Ascending');
  };
  return [order, {setDirection, toggleDirection}];
}

export function useSubtitleQueryInput(query: SearchQuery, order: SearchOrder): SubtitleQueryInput {
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
    hasRecording: true,
    nowRecording: true,
    tId: query?.mode === 'program' ? query.tId : null,
    keywordGroupId: query?.mode === 'keyword' ? query.keywordGroupId : null,
    recordingTypes: modesToRecTypes([query?.mode ?? null]),
    direction: order.direction,
  }), [query, order]);
}

export function buildSearchParams({query, order}: {query?: SearchQuery; order?: SearchOrder}, searchParams?: URLSearchParams) {
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
  return searchParams;
}
