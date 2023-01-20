import React, { createContext, useContext, useState } from "react";

const Context = createContext({});

const ContextProvider = ({ children }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [fileStatus, setFileStatus] = useState("No File Chosen!");
  const [file, setFile] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [conversionInProcess, setConversionInProcess] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [filesConverted, setFilesConverted] = useState([]);
  const [filesNotConverted, setFilesNotConverted] = useState([]);
  const [mailsSent, setMailsSent] = useState([]);
  const [mailsNotSent, setMailsNotSent] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [scannedRows, setScannedRows] = useState(0);

  return (
    <Context.Provider
      value={{
        isSelected,
        setIsSelected,
        fileStatus,
        setFileStatus,
        file,
        setFile,
        isUploaded,
        setIsUploaded,
        isConverted,
        setIsConverted,
        conversionInProcess,
        setConversionInProcess,
        sendMail,
        setSendMail,
        filesConverted,
        setFilesConverted,
        filesNotConverted,
        setFilesNotConverted,
        mailsSent,
        setMailsSent,
        mailsNotSent,
        setMailsNotSent,
        totalRows,
        setTotalRows,
        scannedRows,
        setScannedRows,
      }}>
      {children}
    </Context.Provider>
  );
};

export const ContextState = () => {
  return useContext(Context);
};

export default ContextProvider;
