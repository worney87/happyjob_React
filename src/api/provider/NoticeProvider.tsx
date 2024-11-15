import { createContext, FC, useState } from "react";

interface Context {
  searchkeyword: object;
  setSearchKeyword: (keyword: object) => void;
}
const defaultValue: Context = {
  searchkeyword: {},
  setSearchKeyword: () => {},
};
export const NoticeContext = createContext<Context>(defaultValue);

export const NoticeProvider: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [searchkeyword, setSearchKeyword] = useState({});
  return (
    <NoticeContext.Provider value={{ searchkeyword, setSearchKeyword }}>
      {children}
    </NoticeContext.Provider>
  );
};

export default NoticeContext;
