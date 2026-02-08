import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    return paramsObj;
  }, [searchParams]);

  const getPath = useCallback((baseRouteName: string, routeName?: string, params: Record<string, string> = {}) => {
    let target = "";
    let queryParams = "";
    target = target + (baseRouteName !== "home" ? `/${baseRouteName}` : "");
    target = target + (routeName && routeName !== "main" ? `/${routeName}` : "");
    target = target ? target : "/";

    Object.entries(params).forEach(([key, value]) => {
      queryParams = queryParams + (queryParams.length ? "&" : "") + `${key}=${value}`;
    });

    return target + "?" + queryParams;
  }, []);

  const authNavigator = useMemo(
    () => ({
      navigate: (routeName: string, params?: Record<string, string>) => {
        const path = getPath(routeName, undefined, params);
        navigate(path);
      },
      replace: (routeName: string, params?: Record<string, string>) => {
        const path = getPath(routeName, undefined, params);
        navigate(path, { replace: true });
      },
    }),
    [navigate, getPath]
  );

  const tabNavigator = useMemo(
    () => ({
      navigate: (baseRouteName: string, routeName: string, params?: Record<string, string>) => {
        const path = getPath(baseRouteName, routeName, params);
        navigate(path);
      },
      replace: (baseRouteName: string, routeName: string, params?: Record<string, string>) => {
        const path = getPath(baseRouteName, routeName, params);
        navigate(path, { replace: true });
      },
    }),
    [navigate, getPath]
  );

  const goBack = useCallback(() => {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  }, [navigate, location.key]);

  return {
    authNavigator,
    navigator: tabNavigator,
    goBack,
    params,
    location,
  };
};

export default useNavigation;
