import { Uploader } from '@/domain/application/storage/uploader';

export interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {}
