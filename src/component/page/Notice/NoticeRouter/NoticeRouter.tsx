import { useLocation, useParams } from "react-router-dom";

export const NoticeRouter = () => {
  const { noticeIdx } = useParams<{ noticeIdx: string }>();
  const location = useLocation(); 
  const { title } = location.state || {}; 
  return (
    <>
      <div>
        <h1>Dynamic Router url value : {noticeIdx}</h1>
        <h1>{title && <p>Title: {title}</p>}</h1>
      </div>
    </>
  );
};

