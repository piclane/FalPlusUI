import {Path} from "react-router-dom";
import deepEquals from 'fast-deep-equal';

/**
 * 二つのパスが等価かどうかを返します
 *
 * @param path1 一つ目のパス
 * @param path2 二つ目のパス
 */
export function equalsPath(path1: Path, path2: Path): boolean {
  if(path1.pathname !== path2.pathname || path1.hash !== path2.hash) {
    return false;
  }
  if(path1.search === path2.search) {
    return true;
  } else {
    return deepEquals(
      Object.fromEntries(path1.search.substring(1).split('&').map(pair => pair.split('='))),
      Object.fromEntries(path2.search.substring(1).split('&').map(pair => pair.split('=')))
    );
  }
}
