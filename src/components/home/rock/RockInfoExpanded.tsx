import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";

import Button from "src/components/common/Button";
import RouteStructure from "src/components/common/RouteStructure";
import PaymentModal from "src/components/home/rock/PaymentModal";
import RockGallery from "src/components/home/rock/RockGallery";
import InformationRow from "src/components/rock/details/InformationRow";
import Text from "src/components/ui/Text";
import View from "src/components/ui/View";

import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { usePaymentSheet } from "@stripe/stripe-react-native";
import { useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { CartIcon } from "src/components/icons/Cart";
import OverlayCardView from "src/components/ui/OverlayCardView";
import { useAreas } from "src/hooks/useAreas";
import { RockData } from "src/services/rocks";
import { selectedRockAtom } from "src/store/results";
import { palette } from "src/styles/theme";
import { HomeScreenNavigationProp } from "src/types/type";
import { getRoutesFromRock } from "src/utils/getRoutesFromRock";

const RockInfoExpanded = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedRock, setSelectedRock] = useAtom(selectedRockAtom);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const { rocks } = useAreas();
  const { width } = useWindowDimensions();

  const rock = useMemo(
    () =>
      rocks?.find((rock: RockData) => rock.attributes.uuid === selectedRock),
    [selectedRock],
  );
  const routes = useMemo(() => rock && getRoutesFromRock(rock), [rock]);

  const handleOpenRock = () => {
    navigation.navigate("Rock", {
      id: selectedRock,
    });
    setSelectedRock(null);
  };

  return (
    <View height='100%'>
      <View>
        <View
          paddingHorizontal='m'
          borderBottomWidth={1}
          borderBottomColor='backgroundSecondary'
          paddingBottom='m'
          flexDirection='row'
          paddingTop='s'
          justifyContent='space-between'
          flexShrink={1}
        >
          <View maxWidth={width - 80}>
            <Text variant='h2' color='textBlack'>
              {rock?.attributes.Name}
            </Text>
            <View
              flexDirection='row'
              gap='s'
              maxWidth={width - 80}
              flexWrap='wrap'
            >
              <Text variant='h4'>w sektorze:</Text>
              <Text variant='h4' color='textSecondary'>
                {rock?.attributes.parent.data.attributes.Name}
              </Text>
            </View>
          </View>
          {rock?.attributes.product.data && (
            <OverlayCardView
              justifyContent='center'
              alignItems='center'
              width={50}
            >
              <TouchableOpacity onPress={() => setPaymentModalOpened(true)}>
                <CartIcon size={28} color={palette.green} strokeWidth={1.5} />
              </TouchableOpacity>
            </OverlayCardView>
          )}
        </View>
      </View>
      <FlatList
        data={[0]}
        keyExtractor={(item) => item.toString()}
        renderItem={() => (
          <View>
            <View marginBottom='m'>
              {rock && <InformationRow rock={rock} />}
            </View>
            {routes && <RouteStructure routes={routes} />}
            {rock?.attributes && rock?.attributes.cover.length > 0 && (
              <RockGallery images={rock?.attributes.cover} />
            )}
          </View>
        )}
      />
      <View marginBottom='l' marginHorizontal='m'>
        <Button label='Otwórz skałoplan' onClick={handleOpenRock} />
      </View>
      {paymentModalOpened && (
        <PaymentModal
          opened={paymentModalOpened}
          onClose={() => setPaymentModalOpened(false)}
        />
      )}
    </View>
  );
};

export default RockInfoExpanded;
