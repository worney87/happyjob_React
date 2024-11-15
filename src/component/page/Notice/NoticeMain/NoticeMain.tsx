/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router-dom";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/portal/Portal";
import { modalState } from "../../../../stores/modalState";
import {
  INoitce,
  INoticeListResponse,
} from "../../../../models/interface/store/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";

export const NoticeMain = () => {
  const { search } = useLocation();
  const [noticeList, setNoticeList] = useState<INoitce[]>();
  const [listCount, setListCount] = useState<number>(0);
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [index, setIndex] = useState<number>();
  const [cPage, setCpage] = useState<number>(1);
  useEffect(() => {
    searchNoticeList();
  }, [search]);

  const searchNoticeList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    const searchParam = new URLSearchParams(search);
    searchParam.append("currentPage", currentPage.toString());
    searchParam.append("pageSize", "5");

    const searchList = await postNoticeApi<INoticeListResponse>(
      Notice.getList,
      searchParam
    );
    if (searchList) {
      setNoticeList(searchList.notice);
      setListCount(searchList.noticeCnt);
      setCpage(currentPage);
    }
  };

  const handlerRead = (index: number) => {
    setIndex(index);
    setModal(!modal);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchNoticeList();
  };

  return (
    <>
      총 갯수 : {listCount} 
      현재 페이지 : {cPage}
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
                <tr
                  key={notice.noticeIdx}
                  onClick={() => {
                    handlerRead(notice.noticeIdx);
                  }}
                >
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
      <PageNavigate
        totalItemsCount={listCount}
        itemsCountPerPage={5}
        onChange={searchNoticeList}
        activePage={cPage}
      ></PageNavigate>
      {modal && (
        <Portal>
          <NoticeModal
            onSuccess={onPostSuccess}
            noticeSeq={index}
            setNoticeSeq={setIndex}
          />
        </Portal>
      )}
    </>
  );
};
