/* eslint-disable react-hooks/exhaustive-deps */
import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import {
  IDetailResponse,
  InoticeDetail,
  INoticeModalProps,
  IPostResponse,
} from "../../../../models/interface/store/INotice";

export const NoticeModal: FC<INoticeModalProps> = ({
  onSuccess,
  noticeSeq,
  setNoticeSeq,
}) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLInputElement>();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [noticeDetail, setNoticeDatail] = useState<InoticeDetail>();

  const closeModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    noticeSeq && searchDetail();
    return () => {
      noticeSeq && setNoticeSeq(undefined);
    };
  }, []);

  const searchDetail = () => {
    axios
      .post("/board/noticeDetailJson.do", { noticeSeq })
      .then((res: AxiosResponse<IDetailResponse>) => {
        setNoticeDatail(res.data.detail);
      });
  };

  const handlerSave = () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
    };

    axios
      .put("/board/noticeSaveJson.do", param)
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  const handlerUpdate = () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
      noticeSeq: noticeSeq,
    };
    axios
      .patch("/board/noticeUpdateJson.do", param)
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  const handlerDelete = () => {
    axios
      .post("/board/noticeDeleteJson.do", { noticeSeq })
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  return (
    <NoticeModalStyled>
      <div className="container">
        <label>
          제목 :
          <input
            type="text"
            ref={title}
            defaultValue={noticeDetail?.title}
          ></input>
        </label>
        <label>
          내용 :{" "}
          <input
            type="text"
            ref={context}
            defaultValue={noticeDetail?.content}
          ></input>
        </label>
        파일 :
        <input type="file" id="fileInput" style={{ display: "none" }}></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div>
            <label>미리보기</label>
            <img src="" />
          </div>
        </div>
        <div className={"button-container"}>
          <button onClick={noticeSeq ? handlerUpdate : handlerSave}>
            {noticeSeq ? "수정" : "등록"}
          </button>
          {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
          <button onClick={closeModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
