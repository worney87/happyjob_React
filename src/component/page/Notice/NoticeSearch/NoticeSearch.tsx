import { useEffect, useRef, useState } from 'react';
import { NoticeSearchStyled } from './styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../common/Button/Button';

export const NoticeSearch = () => {
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const title = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        location.search && navigate(location.pathname, { replace: true });
    }, [navigate]);

    const handlerSearch = () => {
        // 검색 버튼을 누르면, 조회가 된다.
        const query: string[] = [];
        !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
        !startDate || query.push(`startDate=${startDate}`);
        !endDate || query.push(`endDate=${endDate}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';
        navigate(`/react/board/notice.do${queryString}`);
    };

    return (
        <NoticeSearchStyled>
            <div className="input-box">
                <input ref={title}></input>
                <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
                <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
                <Button onClick={handlerSearch}>검색</Button>
                {/* <Button onClick={handlerModal}>등록</Button> */}
            </div>
        </NoticeSearchStyled>
    );
};
