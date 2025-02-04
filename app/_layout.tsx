import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="explore" options={{ title: "Explore" }} />
    </Stack>
  );
}
