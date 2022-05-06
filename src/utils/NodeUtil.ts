import {isObject} from "@/utils/TypeUtil";

type BuildClassNameArgument = Record<string, any | null | undefined> | string[] | string | null | undefined;

/**
 * Vue.js みたいなオブジェクト形式のクラス指定方式などから、クラス文字列を生成します
 *
 * @param classes オブジェクト形式のクラス指定オブジェクト・クラス名の配列・クラス名
 *  オブジェクト形式のクラス指定オブジェクトの場合、
 *    キーはクラス名を指定します。
 *    値が true と評価できる場合、キーとなるクラス名が有効になります。
 *    そうでない場合、キーとなるクラス名は有効になりません。
 */
export function buildClassNames(...classes: BuildClassNameArgument[]): string {
  return classes
    .flatMap(cls => {
      if(isObject(cls)) {
        return Object.entries(cls).filter(e => !!e[0] && !!e[1]).map(e => e[0]);
      } else {
        return cls;
      }
    })
    .filter(cls => !!cls)
    .join(' ');
}
