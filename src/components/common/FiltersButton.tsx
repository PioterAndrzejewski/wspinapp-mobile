import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import Text from "src/components/ui/Text";
import View from "src/components/ui/View";

import { FiltersIcon } from "src/components/icons/Filters";
import { useFilters } from "src/context/FilteredRocksContext";
import { HomeScreenNavigationProp } from "src/types/type";

const FiltersButton = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { activeFiltersCount } = useFilters();

  const handleNavigation = () => navigation.navigate("Filters");
  return (
    <View position='absolute' right={20} top={5} overflow='visible'>
      <TouchableOpacity onPress={handleNavigation}>
        <FiltersIcon size={28} />
        {activeFiltersCount > 0 && (
          <View
            height={17}
            width={16}
            justifyContent='center'
            alignItems='center'
            borderRadius={50}
            backgroundColor='backgroundError'
            position='absolute'
            alignSelf='flex-end'
            style={{
              transform: "translateY(10px)",
            }}
            pointerEvents='none'
          >
            <Text variant='filter' color='textWhite'>
              {activeFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FiltersButton;
