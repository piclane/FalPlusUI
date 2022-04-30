import {gql, useQuery} from "@apollo/client";
import {KeywordGroup, KeywordGroupQueryInput, Program, ProgramQueryInput, ProgramResult} from "@/Model";
import {isNumber} from "@/utils/TypeUtil";
import {Autocomplete, TextField} from "@mui/material";
import React, {Dispatch} from "react";
import {SearchQuery, useSearchVideoTypes} from "@/components/pages/recording/list/SearchParams";

const FIND_OPTIONS = gql`
    query FindOptions (
        $queryProgram: ProgramQueryInput,
        $queryKeywordGroup: KeywordGroupQueryInput
    ) {
        programs(query: $queryProgram, offset: 0, limit: 1000) {
            total
            data {
                tId
                title
            }
        }
        keywordGroups(query: $queryKeywordGroup) {
            keywordGroupId
            keyword
        }
    }
`;

interface FilterOption {
  type: 'program' | 'keywordGroup';
  key: any;
  value: Program | KeywordGroup;
  label: string;
}

const toFilterOption = (obj: Program | KeywordGroup): FilterOption => {
  if('keywordGroupId' in obj) {
    return {type: 'keywordGroup', key: obj.keywordGroupId, value: obj, label: obj.keyword};
  } else {
    return {type: 'program', key: obj.tId, value: obj, label: obj.title};
  }
}

const toSafeFilterOption = (obj?: Program | KeywordGroup | null): FilterOption | null => {
  if(obj === null || obj === undefined) {
    return null;
  } else {
    return toFilterOption(obj);
  }
}

export default function QuerySelect({query, setQuery}: {
  query: SearchQuery;
  setQuery: Dispatch<SearchQuery>;
}) {
  const [videoTypes] = useSearchVideoTypes();
  const { loading, error, data } = useQuery<{programs: ProgramResult; keywordGroups: KeywordGroup[]}>(FIND_OPTIONS, {
    variables: {
      queryProgram: {
        hasRecording: videoTypes.length === 0 ? true : undefined,
        videoTypes,
      } as ProgramQueryInput,
      queryKeywordGroup: {
        hasRecording: videoTypes.length === 0 ? true : undefined,
        videoTypes,
      } as KeywordGroupQueryInput,
    }
  });

  const programs = data?.programs.data ?? [];
  const selectedProgram = (() => {
    if(query?.mode === 'program' && isNumber(query?.tId)) {
      return toSafeFilterOption(programs.find(p => p.tId === query.tId));
    } else {
      return null;
    }
  })();

  const keywordGroups = data?.keywordGroups ?? [];
  const selectedKeywordGroup = (() => {
    if(query?.mode === 'keyword' && isNumber(query?.keywordGroupId)) {
      return toSafeFilterOption(keywordGroups.find(kg => kg.keywordGroupId === query.keywordGroupId));
    } else {
      return null;
    }
  })();

  const options = (() => {
    const result = [];
    if(query?.mode !== 'keyword') {
      for (const p of programs) {
        result.push(toFilterOption(p));
      }
    }
    if(query?.mode !== 'program') {
      for (const kg of keywordGroups) {
        result.push(toFilterOption(kg));
      }
    }
    return result;
  })();

  return (
    <Autocomplete
      size="small"
      blurOnSelect={true}
      autoComplete={true}
      value={selectedProgram ?? selectedKeywordGroup}
      loading={loading}
      options={options}
      getOptionLabel={opt => opt.label}
      isOptionEqualToValue={(opt, value) => opt.type === value.type && opt.key === value.key}
      groupBy={opt => {
        switch(opt.type) {
          case 'program': return '番組';
          case 'keywordGroup': return 'キーワード';
        }
      }}
      onChange={(event, newValue) => {
        if(newValue === null) {
          setQuery(null);
        } else if(newValue.type === 'program') {
          setQuery({mode: 'program', tId: newValue.key});
        } else if(newValue.type === 'keywordGroup') {
          setQuery({mode: 'keyword', keywordGroupId: newValue.key});
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={(() => {
            if(error) {
              return '読込に失敗しました 😭';
            }
            switch(query?.mode) {
              case 'program': return '番組';
              case 'keyword': return 'キーワード';
              default:        return '番組/キーワード';
            }
          })()}
        />
      )} />
  );
}
