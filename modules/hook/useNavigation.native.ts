import { useCallback, useMemo } from "react";
import { CommonActions, useNavigation as useNativeNavigation, useRoute } from "@react-navigation/native";

const useNavigation = () => {
  const navigation = useNativeNavigation();
  const route = useRoute();

  const authNavigator = useMemo(
    () => ({
      navigate: (routeName: string, params?: Record<string, any>) => {
        //@ts-ignore
        navigation.navigate("auth", { screen: routeName, params });
      },
      replace: (routeName: string, params?: Record<string, any>) => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "auth", params: { screen: routeName, params } }],
          })
        );
      },
    }),
    [navigation]
  );

  const tabNavigator = useMemo(
    () => ({
      navigate: (baseRouteName: string, routeName: string = "main", params?: Record<string, any>) => {
        //@ts-ignore
        navigation.navigate("tab", {
          screen: baseRouteName,
          params: { screen: routeName, params },
        });
      },
      replace: (baseRouteName: string, routeName: string = "main", params?: Record<string, any>) => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "tab",
                params: {
                  screen: baseRouteName,
                  params: { screen: routeName, params },
                },
              },
            ],
          })
        );
      },
    }),
    [navigation]
  );

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return {
    authNavigator,
    navigator: tabNavigator,
    goBack,
    params: route.params,
    location: route,
  };
};

export default useNavigation;
