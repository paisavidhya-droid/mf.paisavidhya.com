import React, { useContext } from "react";
import { Image, ImageSourcePropType, StyleProp, StyleSheet, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";

import { colors } from "@niveshstar/constant";
import { ScreenContext } from "@niveshstar/context";

import FlexRow from "./FlexRow";
import Padding from "./Padding";
import PrimaryButton from "./Button";
import Typography from "./Typography";

interface PropsType {
  title: string;
  excerpt: string;
  listText: string[];
  onPress: () => void;
  imgUrl?: ImageSourcePropType;
  style?: StyleProp<any>;
}

export default function PlanCard(props: PropsType) {
  const screenSize = useContext(ScreenContext).screenType;
  const {
    title,
    excerpt,
    listText,
    onPress,
    imgUrl = "https://source.unsplash.com/random/1920x1080" as ImageSourcePropType,
    style = {},
  } = props;

  return (
    <View style={[styles.card, { width: screenSize === "sm" ? "100%" : "30%" }, { ...style }]}>
      <Image source={imgUrl} style={styles.img} />
      <View style={styles.innerCard}>
        <Typography size="h2" weight={"600"}>
          {title}
        </Typography>
        <Padding height={10} />
        <Typography size="h5" justify>
          {excerpt}
        </Typography>
        <Padding height={30} />
        <FlexRow vCenter>
          <AntDesign name="barchart" size={24} color={colors.black} />
          <Padding width={20} />
          <Typography size="h5" style={{ flex: 1 }}>
            {listText[0]}
          </Typography>
        </FlexRow>
        <Padding height={15} />
        <FlexRow vCenter>
          <Entypo name="leaf" size={24} color={colors.black} />
          <Padding width={20} />
          <Typography size="h5" style={{ flex: 1 }}>
            {listText[1]}
          </Typography>
        </FlexRow>
        <Padding height={15} />
        <FlexRow vCenter>
          <AntDesign name="star" size={24} color={colors.black} />
          <Padding width={20} />
          <Typography size="h5" style={{ flex: 1 }}>
            {listText[2]}
          </Typography>
        </FlexRow>
      </View>
      <Padding height={20} />
      <PrimaryButton title="Explore" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: colors.bgGray,
  },
  img: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    width: "100%",
    height: 210,
  },
  innerCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 20,
  },
});
