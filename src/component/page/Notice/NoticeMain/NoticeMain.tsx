/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router-dom";
import {
  StyledTable,
  StyledTd,
  StyledTh,
} from "../../../common/styled/StyledTable";
import { useContext, useEffect, useState } from "react";
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
import NoticeContext from "../../../../api/provider/NoticeProvider";

export const NoticeMain = () => {
  const { search } = useLocation();
  const [noticeList, setNoticeList] = useState<INoitce[]>();
  const [listCount, setListCount] = useState<number>(0);
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [index, setIndex] = useState<number>();
  const [cPage, setCpage] = useState<number>(1);
  const { searchkeyword } = useContext(NoticeContext);
  const navigate = useNavigate();

  useEffect(() => {
    searchNoticeListbyProvider();
  }, [searchkeyword]);

  const searchNoticeListbyProvider = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    const searchParam = {
      currentPage: currentPage.toString(),
      pageSize: 10,
      ...searchkeyword,
    };
    console.log(searchParam);

    const searchList = await postNoticeApi<INoticeListResponse>(
      Notice.getListByProvider,
      searchParam
    );
    if (searchList) {
      setNoticeList(searchList.notice);
      setListCount(searchList.noticeCnt);
      setCpage(currentPage);
    }
  };

  // useEffect(() => {
  //   searchNoticeList();
  // }, [search]);

  // const searchNoticeList = async (currentPage?: number) => {
  //   currentPage = currentPage || 1;
  //   const searchParam = new URLSearchParams(search);
  //   searchParam.append("currentPage", currentPage.toString());
  //   searchParam.append("pageSize", "10");

  //   const searchList = await postNoticeApi<INoticeListResponse>(
  //     Notice.getList,
  //     searchParam
  //   );
  //   if (searchList) {
  //     setNoticeList(searchList.notice);
  //     setListCount(searchList.noticeCnt);
  //     setCpage(currentPage);
  //   }
  // };

  const handlerRead = (index: number) => {
    setIndex(index);
    setModal(!modal);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    //searchNoticeList();
    searchNoticeListbyProvider();
  };

  const handlerDynamicRouter = (noticeIdx: number) => {
    navigate(`${noticeIdx}`);
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
                  // onClick={() => {
                  //   handlerRead(notice.noticeIdx);
                  // }
                  onClick={() =>
                    navigate(`${notice.noticeIdx}`, {
                      state: { title: notice.title },
                    })
                  }
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
        itemsCountPerPage={10}
        // onChange={searchNoticeList}
        onChange={searchNoticeListbyProvider}
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
