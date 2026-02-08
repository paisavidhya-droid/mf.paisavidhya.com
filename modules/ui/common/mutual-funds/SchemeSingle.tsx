import React, { useContext, useEffect } from "react";
import { ActivityIndicator } from "react-native";

import { ThemeContext, useGetSchemeByIdQuery } from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";

import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import SchemeDetails from "./SchemeDetails";

export default function SchemeSingle() {
  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const { data: schemeData = { data: null }, isLoading } = useGetSchemeByIdQuery(params?.schemeId, {
    skip: !params?.schemeId,
  });

  useEffect(() => {
    if (!params?.schemeId) {
      navigator.navigate("home", "mutual-funds");
    }
  }, [params, navigator]);

  return (
    <CustomCard style={{ flexGrow: 1 }}>
      {isLoading ? (
        <FlexRow justifyContent="center" alignItems="center" style={{ flexGrow: 1 }}>
          <ActivityIndicator size={40} color={themeColor.accent[9]} />
        </FlexRow>
      ) : null}

      {!isLoading && schemeData.data ? <SchemeDetails data={schemeData.data} /> : null}
    </CustomCard>
  );
}
