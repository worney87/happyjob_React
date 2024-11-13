import { Link, useLocation } from "react-router-dom";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRecoilState } from "recoil";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Button } from "react-bootstrap";
import { Portal } from "../../../common/portal/Portal";
import { modalState } from "../../../../stores/modalState";

interface INoitce {
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

export const NoticeMain = () => {
  const { search } = useLocation();
  const [noticeList, setNoticeList] = useState<INoitce[]>();
  const [listCount, setListCount] = useState<number>(0);
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  useEffect(() => {
    searchNoticeList();
  }, [search]);

  const searchNoticeList = (currentPage?: number) => {
    currentPage = currentPage || 1;
    const searchParam = new URLSearchParams(search);
    searchParam.append("currentPage", currentPage.toString());
    searchParam.append("pageSize", "5");

    axios.post("/board/noticeListJson.do", searchParam).then((res) => {
      setNoticeList(res.data.notice);
      setListCount(res.data.noticeCnt);
    });
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  return (
    <>
      총 갯수 : {listCount} 현재 페이지 : 0
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={10}>작성자</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {noticeList && noticeList.length > 0 ? (
            noticeList?.map((notice, index) => {
              return (
                <tr key={notice.noticeIdx} onClick={handlerModal}>
                  <StyledTd>{index + 1}</StyledTd>
                  <StyledTd>{notice.title}</StyledTd>
                  <StyledTd>{notice.author}</StyledTd>
                  <StyledTd>{notice.createdDate}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      {modal && (
        <Portal>
          <NoticeModal/>
        </Portal>
      )}
    </>
  );
};
