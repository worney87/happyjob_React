export interface INoticeListResponse {
  notice: INoitce[];
  noticeCnt: number;
}

export interface INoitce {
  author: string;
  content: string;
  createdDate: string;
  fileExt: string | null;
  fileName: string | null;
  fileSize: number | null;
  logicalPath: string | null;
  noticeIdx: number;
  phsycalPath: string | null;
  title: string;
  updatedDate: string | null;
}

export interface IPostResponse {
  result: string;
}

export interface INoticeModalProps {
  onSuccess: () => void;
  noticeSeq: number;
  setNoticeSeq: (noticeSeq: number | undefined) => void;
}

export interface InoticeDetail extends INoitce {
  content: string;
  fileExt: string | null;
  fileName: string | null;
  fileSize: number | null;
  logicalPath: string | null;
  phsycalPath: string | null;
  title: string;
}

export interface IDetailResponse {
  detail: InoticeDetail;
}
