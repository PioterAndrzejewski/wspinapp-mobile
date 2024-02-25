import { SafeAreaView } from "react-native-safe-area-context";

import ScreenTitle from "src/components/common/ScreenTitle";
import Map from "src/components/home/Map";
import ResultsList from "src/components/home/ResultsList";

import { palette } from "src/styles/theme";

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.white }}>
      <ScreenTitle centered title='Mapa' hasFilters/>
      <Map />
      <ResultsList />
    </SafeAreaView>
  );
}
