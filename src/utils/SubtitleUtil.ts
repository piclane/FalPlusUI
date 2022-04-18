import {Subtitle} from "@/Model";
import {isNumber} from "@/utils/TypeUtil";

export interface Titles {
  title: string;
  subtitle: string;
}

export function normalizeTitle(subtitle: Subtitle): Titles {
  const s = subtitle;
  if(s.tId === TID_KEYWORD) {
    return {
      title: s.keywordGroups?.map(kg => kg.keyword)?.join('/') ?? '',
      subtitle: s.subtitle ?? ''
    };
  } else if(s.tId === TID_EPG) {
    const str = s.subtitle;
    if(!str) {
      return {title: '', subtitle: ''};
    }
    const m = /^([^ 「◇◆☆★▽▼]+)(.*)$/.exec(str);
    if(!m) {
      return {title: '', subtitle: ''};
    }
    return {title: m[1], subtitle: m[2]};
  } else {
    return {
      title: s.program.title,
      subtitle: isNumber(s.countNo)
        ? `${s.countNo}話 ${s.subtitle ?? ''}`
        : `${s.subtitle ?? ''}`
    };
  }
}

export const TID_KEYWORD = -1;

export const TID_EPG = 0;
