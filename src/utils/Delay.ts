/**
 * timeout ミリ秒後に実行される Promise を返します
 *
 * @param timeout 実行されるまでの時間 (ミリ秒)
 */
export default function delay(timeout: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  })
}
