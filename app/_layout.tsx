import { Stack } from "expo-router";

export default function RootLayout() {
  // I am not seeing the header
  return <Stack screenOptions={{headerShown: false}}/>;
}
