import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import RootNavigator from "src/navigators/RootNavigator";
import AppLoading from "src/components/common/AppLoading";

import { FavoritesContextProvider } from "src/context/FavoritesContext";

Reactotron.setAsyncStorageHandler!(AsyncStorage)
  .configure()
  .useReactNative()
  .connect();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, cacheTime: 1000 * 60 * 60 * 24 * 30 * 12 },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function App() {
  const [fontLoaded] = useFonts({
    PoppinsBold: require("src/assets/fonts/PoppinsBold.ttf"),
    PoppinsMedium: require("src/assets/fonts/PoppinsMedium.ttf"),
    PoppinsRegular: require("src/assets/fonts/PoppinsRegular.ttf"),
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <NavigationContainer>
            <BottomSheetModalProvider>
              <FavoritesContextProvider>
                <RootNavigator />
              </FavoritesContextProvider>
            </BottomSheetModalProvider>
          </NavigationContainer>
        </PersistQueryClientProvider>
      </GestureHandlerRootView>
      <Toast topOffset={60} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
