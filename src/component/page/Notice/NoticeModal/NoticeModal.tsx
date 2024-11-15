/* eslint-disable react-hooks/exhaustive-deps */
import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
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
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [noticeDetail, setNoticeDatail] = useState<InoticeDetail>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [fileData, setFileData] = useState<File>();
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLInputElement>();

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
        const detail = res.data.detail;
        setNoticeDatail(detail);
        const { fileExt, logicalPath, fileName } = detail;
        if (
          fileExt === "png" ||
          fileExt === "jpg" ||
          fileExt === "gif" ||
          fileExt === "jpeg"
        ) {
          setImageUrl(logicalPath);
          setFileData({ name: fileName } as File);
        } else {
          setImageUrl(undefined);
        }
      });
  };

  // const handlerSave = () => {
  //   const param = {
  //     title: title.current.value,
  //     context: context.current.value,
  //     loginId: userInfo.loginId,
  //   };

  //   axios
  //     .put("/board/noticeSaveJson.do", param)
  //     .then((res: AxiosResponse<IPostResponse>) => {
  //       res.data.result === "success" && onSuccess();
  //     });
  // };

  // const handlerUpdate = () => {
  //   const param = {
  //     title: title.current.value,
  //     context: context.current.value,
  //     loginId: userInfo.loginId,
  //     noticeSeq: noticeSeq,
  //   };
  //   axios
  //     .patch("/board/noticeUpdateJson.do", param)
  //     .then((res: AxiosResponse<IPostResponse>) => {
  //       res.data.result === "success" && onSuccess();
  //     });
  // };

  const handlerDelete = () => {
    axios
      .post("/board/noticeDeleteJson.do", { noticeSeq })
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    if (fileInfo && fileInfo.length > 0) {
      const fileType = fileInfo[0].type.split("/")[0];
      console.log(fileType);
      console.log(fileInfo);
      if (fileType === "image") {
        setImageUrl(URL.createObjectURL(fileInfo[0]));
      } else {
        setImageUrl(undefined);
      }
    }
    setFileData(fileInfo[0]);
  };

  const handlerFileSave = () => {
    const fileForm = new FormData();
    const textData = {
      noticeTit: title.current.value,
      noticeCon: context.current.value,
      loginId: userInfo.loginId,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append(
      "text",
      new Blob([JSON.stringify(textData)], { type: "application/json" })
    );

    axios
      .post("/board/noticeSaveForm.do", fileForm)
      .then((res: AxiosResponse<IPostResponse>) => {
        res.data.result === "success" && onSuccess();
      });
  };

  const hadlerFileUpdate = () => {
    const fileForm = new FormData();
    const textData = {
      noticeTit: title.current.value,
      noticeCon: context.current.value,
      loginId: userInfo.loginId,
      noticeSeq: noticeSeq,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append(
      "text",
      new Blob([JSON.stringify(textData)], { type: "application/json" })
    );
    axios
      .post("/board/noticeUpdateForm.do", fileForm)
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
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handlerFile}
        ></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div>
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="preview" />
                <p>{fileData?.name}</p>
              </>
            ) : (
              <p>{fileData?.name}</p>
            )}
          </div>
        </div>
        <div className={"button-container"}>
          <button onClick={noticeSeq ? hadlerFileUpdate : handlerFileSave}>
            {noticeSeq ? "수정" : "등록"}
          </button>
          {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
          <button onClick={closeModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
