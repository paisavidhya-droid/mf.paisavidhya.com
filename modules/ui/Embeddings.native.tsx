import React, { useRef } from "react";
import { StyleProp } from "react-native";
import { WebView } from "react-native-webview";

interface PropsType {
  url: string;
  style?: StyleProp<any>;
  message?: any;
  html?: string;
}

export default function Embeddings(props: PropsType) {
  const iframeRef = useRef(null);
  const { url, message, html, style = {} } = props;
  const baseUrl = process.env.EXPO_PUBLIC_EMBED_URL_FOR_MOBILE;
  const data = encodeURIComponent(JSON.stringify(message));

  if (html) {
    return <WebView ref={iframeRef} source={{ html: html }} style={style} />;
  }

  return <WebView ref={iframeRef} source={{ uri: `${baseUrl}${url}?data=${data}` }} style={style} />;
}
