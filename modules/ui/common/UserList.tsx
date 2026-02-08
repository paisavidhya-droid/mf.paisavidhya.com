import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { RootStateType, ThemeContext, useLazyGetInvestorProfileListQuery } from "@niveshstar/context";
import { useDebounce, useNavigation } from "@niveshstar/hook";

import ControlledInput from "../ControlledInput";
import EmptyResult from "../EmptyResult";
import UserListRow from "./UserListRow";

interface PropsType {
  closeModal?: () => void;
}

function UserList(props: PropsType) {
  const { closeModal } = props;
  const { navigator, params } = useNavigation();
  const { themeColor } = useContext(ThemeContext);

  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const authDetail = useSelector((state: RootStateType) => state.auth);

  const [getInvestorProfileApi, { isLoading: isGettingInvestorList }] = useLazyGetInvestorProfileListQuery();

  const { control, watch } = useForm({
    defaultValues: {
      query: "",
    },
    reValidateMode: "onSubmit",
  });

  const query = watch("query");
  const searchQuery = useDebounce(query, 300);

  const handleUserClick = useCallback(
    (data: any) => {
      const payload: any = {
        ...params,
        investorId: data.id,
      };

      if (closeModal) closeModal();
      navigator.navigate("home", "user", payload);
    },
    [navigator, params, closeModal]
  );

  const fetchInvestorList = useCallback(
    async (name: string, currentPage: number, shouldAppend: boolean = false) => {
      try {
        const res = await getInvestorProfileApi({ page: currentPage, limit: 20, name }).unwrap();
        const { list, limit, total } = res.data;

        const hasMorePages = total > currentPage * limit;
        setHasMore(hasMorePages);

        if (shouldAppend) setUserList((prev) => [...prev, ...list]);
        else setUserList(list);
      } catch {
        //pass
      }
    },
    [getInvestorProfileApi]
  );

  const handleLoadMore = useCallback(() => {
    if (!isGettingInvestorList && hasMore) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchInvestorList(searchQuery, nextPage, true);
        return nextPage;
      });
    }
  }, [isGettingInvestorList, hasMore, searchQuery, fetchInvestorList]);

  useEffect(() => {
    if (!authDetail.id) return;

    setPage(1);
    fetchInvestorList(searchQuery, 1, false);
  }, [searchQuery, authDetail.id, fetchInvestorList]);

  return (
    <View style={[styles.container, { backgroundColor: themeColor.gray[1] }]}>
      <View style={styles.searchContainer}>
        <ControlledInput
          name="query"
          control={control}
          placeholder="Search using name, phone, pan"
          inputMode="search"
        />
      </View>

      <FlashList
        data={userList}
        extraData={params}
        estimatedItemSize={200}
        ListEmptyComponent={EmptyResult}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isGettingInvestorList && page > 1 ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" color={themeColor.accent[9]} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <UserListRow data={item} handleUserClick={handleUserClick} isActive={params.investorId === item.id} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 6,
    marginBottom: -16,
  },
});

export default React.memo(UserList);
