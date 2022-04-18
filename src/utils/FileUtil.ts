import {isString} from "@/utils/TypeUtil";

/**
 * ファイル選択ダイアログを表示します
 *
 * @param multiple ファイルの複数選択を許可する場合は true そうでない場合は false
 * @param accept 選択可能なファイルタイプを指定します
 */
function openFileDialog(multiple: boolean, accept: string[]): Promise<Blob[]> {
  return new Promise<Blob[]>(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept.join(',');
    input.style.width = '0';
    input.style.height = '0';
    input.style.position = 'absolute';
    document.body.appendChild(input);
    input.addEventListener('change', _ => {
      resolve(Array.from(input.files ?? []));
    });
    input.click();

    setTimeout(() => {
      input.remove();
    }, 0);
  });
}

/**
 * 指定された Blob または URL をユーザーにダウンロードさせます
 *
 * @param blobOrUrl ダウンロードするファイルの Blob または URL
 * @param filename ファイル名
 */
export function downloadFile(blobOrUrl: Blob | string, filename: string) {
  const url = isString(blobOrUrl) ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 10);
}

/**
 * ファイル選択ダイアログを表示します
 *
 * @param accept 選択可能なファイルタイプを指定します
 */
export function uploadFile(accept: string[]): Promise<Blob> {
  return openFileDialog(false, accept).then(files => {
    return files.length ? Promise.resolve(files[0]) : Promise.reject();
  });
}

/**
 * ファイル選択ダイアログを表示します
 *
 * @param accept 選択可能なファイルタイプを指定します
 */
export function uploadFiles(accept: string[]): Promise<Blob[]> {
  return openFileDialog(true, accept);
}

/**
 * Data URI scheme を Blob に変換します
 *
 * @param dataUri 変換する Data URI scheme
 */
export function convertDataUriToBlob(dataUri: string): Blob {
  const parse = dataUri.slice(5).split(/[,;]/);
  const binStr = atob(parse.pop() as string);
  const l = binStr.length;
  const array = new Uint8Array(l);
  for (let i = 0; i < l; i++) {
    array[i] = binStr.charCodeAt(i);
  }
  return new Blob([array], {type: parse[0]});
}

/**
 * 画像を読み込みます
 *
 * @param url 画像の URL
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { resolve(img) };
    img.onerror = (e) => { reject(e) };
    img.src = url;
  });
}
