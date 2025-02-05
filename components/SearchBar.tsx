import React, { memo } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const SearchBar: React.FC = () => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="코인명/심볼 검색"
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: "#1D232A",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    color: "#fff",
  },
});

export default memo(SearchBar);
