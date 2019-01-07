const WINDOW = window as any;

/**
 * Скачивание файлов из blob
 */
export class FileSaver {
  static URL: any = WINDOW.URL || WINDOW.webkitURL || WINDOW;

  static download(blobData: Blob, fileName: string = '') {
    const link = document.createElement('a');
    const downloadUrl = FileSaver.dataUrl(blobData);
    const isSafari = WINDOW.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

    if ('download' in link) {
      this.simpleDownload(blobData, fileName);
    } else if (isSafari) {
      FileSaver.safariDownload(blobData);
    } else if (WINDOW.navigator.msSaveOrOpenBlob) {
      FileSaver.ieDownload(blobData, fileName);
    } else {
      WINDOW.open(downloadUrl, '_blank');
    }

    FileSaver.clear(downloadUrl, link);
  }

  static safariDownload(blobData: Blob) {
    const reader = new FileReader();

    reader.onloadend = () => {
      const url = reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
      const popup = WINDOW.open(url, '_blank');

      if (!popup) {
        WINDOW.location.href = url;
      }
    };

    reader.readAsDataURL(blobData);
  }

  static simpleDownload(blobData: Blob, fileName: string) {
    const link = document.createElement('a');
    const downloadUrl = FileSaver.dataUrl(blobData);

    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    FileSaver.clear(downloadUrl, link);
  }

  static ieDownload(blobData: Blob, fileName: string) {
    WINDOW.navigator.msSaveOrOpenBlob(blobData, fileName);
  }

  static dataUrl(blobData: Blob): string {
    return FileSaver.URL.createObjectURL(blobData);
  }

  static clear(downloadUrl: string, link?: HTMLElement) {
    setTimeout(() => {
      if (link && link.parentElement) {
        link.parentElement.removeChild(link);
      }

      FileSaver.URL.revokeObjectURL(downloadUrl);
    }, 100);
  }
}
