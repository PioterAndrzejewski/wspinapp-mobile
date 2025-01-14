import { useNavigation } from "@react-navigation/native";
import { useAtomValue, useSetAtom } from "jotai";
import type { FC } from "react";
import { TouchableOpacity } from 'react-native-gesture-handler';

import Text from "src/components/ui/Text";
import View from "src/components/ui/View";

import { HeartIcon } from "src/components/icons/Heart";
import { useFavoriteContext } from "src/context/FavoritesContext";
import { Coordinates, Route } from "src/services/rocks";
import { confirmActionAtom } from "src/store/global";
import { mapAtom, selectedRockAtom } from "src/store/results";
import { styleGuide } from "src/styles/theme";
import { HomeScreenNavigationProp } from "src/types/type";
import { getFavoriteColor } from "src/utils/getFavoriteColor";
import { getRegionForZoom } from "src/utils/getRegionForZoom";
import { getZoomFromStage } from "src/utils/getZoomFromStage";
import { getMeaningfulGrade } from "src/utils/language/getMeaningfulGrade";

export type RoutesParent = {
  name: string;
  coordinates: Coordinates;
  id: string;
};

export type RouteWithParent = Route & { parent: RoutesParent };

type ListResultProps = {
  id: string;
  name: string;
  item: RouteWithParent;
  isRock?: boolean;
};

const ResultsItemRoute: FC<ListResultProps> = ({ id, name, item, isRock }) => {
  const map = useAtomValue(mapAtom);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const setSelectedRock = useSetAtom(selectedRockAtom);
  const { checkRouteInFavorites, removeRouteFromFavorites } =
    useFavoriteContext();
  const isFavorite = checkRouteInFavorites(id);
  const setConfirmAction = useSetAtom(confirmActionAtom);

  const animateTo = (item: RouteWithParent) => {
    navigation.navigate("Map");
    const newRegion = getRegionForZoom(
      item?.parent?.coordinates?.latitude,
      item?.parent?.coordinates?.longitude,
      getZoomFromStage(3),
    );
    setTimeout(() => {
      if (map && map.current) {
        map.current.animateToRegion(newRegion);
      }
      if (isRock) setSelectedRock(item.parent.id);
    });
  };

  const handlePress = () => {
    animateTo(item);
    if (isRock) setSelectedRock(id);
  };

  const handleHeartPress = () => {
    if (isFavorite) {
      setConfirmAction({
        confirmFn: () => removeRouteFromFavorites(item),
        message: `Usuwasz drogę ${item.attributes.display_name} z zapisanych`,
      });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        flexDirection='row'
        marginBottom='s'
        padding='s'
        alignItems='center'
        {...styleGuide.cardShadow}
      >
        <View flexBasis={44} borderRightWidth={1} borderColor='textGray'>
          <Text variant='h3' color='textSecondary'>
            {getMeaningfulGrade(item.attributes.grade)}
          </Text>
        </View>
        <View marginLeft='m'>
          <Text variant='h3'>{name}</Text>
          <View flexDirection='row' gap='s'>
            <Text variant='body' color='textGray'>
              Skała:
            </Text>
            <Text variant='body' color='textSecondary'>
              {item.parent.name}
            </Text>
          </View>
        </View>
        {isFavorite && (
          <TouchableOpacity
            onPress={handleHeartPress}
            hitSlop={12}
            style={{ flexGrow: 1 }}
          >
            <View
              flexDirection='row'
              justifyContent='flex-end'
              alignItems='center'
              flex={1}
            >
              <HeartIcon size={24} fill={getFavoriteColor(isFavorite)} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ResultsItemRoute;
