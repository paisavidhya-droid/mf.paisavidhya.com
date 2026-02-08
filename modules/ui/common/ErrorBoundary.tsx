import React, { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";

import { ColorsType } from "@niveshstar/constant";

import Button from "../Button";
import Padding from "../Padding";
import Typography from "../Typography";

const faceDown = Asset.fromModule(require("@niveshstar/assets/img/face-down.png")).uri;

interface PropsType {
  children: ReactNode;
  navigate: (baseRouteName: string, routeName?: string, state?: any) => void;
  themeColor: ColorsType;
}

interface StateType {
  isError: boolean;
  errorMsg: string;
}

export default class ErrorBoundary extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      isError: false,
      errorMsg: "",
    };

    this.handleGoHome = this.handleGoHome.bind(this);
  }

  static getDerivedStateFromError(error: Error): StateType {
    return {
      isError: true,
      errorMsg: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleGoHome() {
    this.setState({ isError: false, errorMsg: "" });
    this.props.navigate("home", "main");
  }

  render() {
    if (this.state.isError) {
      return (
        <View style={[styles.container, { backgroundColor: this.props.themeColor.gray[1] }]}>
          <Image source={{ uri: faceDown }} style={styles.img} resizeMode="stretch" resizeMethod="scale" />
          <Padding height={24} />
          <Typography size="7" weight="bold">
            Something went wrong.
          </Typography>
          <Padding height={12} />
          <Typography color={this.props.themeColor.red[11]} size="3" align="center">
            {this.state.errorMsg}
          </Typography>
          <Padding height={24} />
          <Button title="Go Home" onPress={this.handleGoHome} variant="soft" />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  img: {
    width: 120,
    height: 120,
  },
});
