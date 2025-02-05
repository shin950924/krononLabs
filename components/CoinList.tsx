import CoinRow from "./CoinRow";
import React, { memo, useCallback } from "react";
import { CoinListProps, CoinData } from "@/type";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";

const CoinList: React.FC<CoinListProps> = ({ coinList }) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CoinData>) => <CoinRow coin={item} />,
    []
  );

  return (
    <FlatList
      data={coinList}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 20,
  },
});

export default memo(CoinList);
