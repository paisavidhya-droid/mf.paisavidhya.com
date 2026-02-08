import React, { CSSProperties, useRef } from "react";

interface PropsType {
  url: string;
  style?: CSSProperties;
  message?: any;
  html?: string;
}

export default function Embeddings(props: PropsType) {
  const iframeRef = useRef(null);
  const { url, message, style = {} } = props;
  const baseUrl = process.env.EXPO_PUBLIC_EMBED_URL_FOR_WEB;
  const data = encodeURIComponent(JSON.stringify(message));

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`${baseUrl}${url}?data=${data}`}
        style={{
          border: 0,
          outline: 0,
          flex: 1,
          ...style,
        }}
      />
    </>
  );
}
