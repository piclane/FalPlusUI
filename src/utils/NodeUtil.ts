/**
 * Vue.js みたいなオブジェクト形式のクラス指定方式から、クラス文字列を生成します
 *
 * @param classes オブジェクト形式のクラス指定オブジェクト
 *    キーはクラス名を指定します。
 *    値が true と評価できる場合、キーとなるクラス名が有効になります。
 *    そうでない場合、キーとなるクラス名は有効になりません。
 */
export function buildClassNames(classes: Record<string, any | null | undefined>): string {
  return Object.entries(classes).filter(e => !!e[0] && !!e[1]).map(e => e[0]).join(' ');
}
