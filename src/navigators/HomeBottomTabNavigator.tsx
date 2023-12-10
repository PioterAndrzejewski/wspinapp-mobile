import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { View } from "react-native";

import FilterBar from "src/components/home/FilterBar";
import FavouritesScreen from "src/screens/FavouritesScreen";
import MapScreen from "src/screens/MapScreen";
import SearchScreen from "src/screens/SearchScreen";

import { HeartIcon } from "src/components/icons/Heart";
import { MapIcon } from "src/components/icons/Map";
import { SearchIcon } from "src/components/icons/Search";

import { BottomTabParamList } from "src/types/type";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ICONS = {
  Map: {
    active: MapIcon,
    inactive: MapIcon,
  },
  Search: {
    active: SearchIcon,
    inactive: SearchIcon,
  },
  Favourites: {
    active: HeartIcon,
    inactive: HeartIcon,
  },
};

const renderIcon = ({
  focused,
  size,
  route,
}: {
  focused: boolean;
  size: number;
  route: RouteProp<BottomTabParamList, keyof BottomTabParamList>;
}) => {
  const Icon = focused
    ? TAB_ICONS[route.name].active
    : TAB_ICONS[route.name].inactive;

  return <Icon size={size} color={focused ? "#000" : "#999"} />;
};

const HomeBottomTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <FilterBar />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) =>
            renderIcon({ focused, size, route }),
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: "#eeeeee13",
        })}
      >
        <Tab.Screen name='Map' component={MapScreen} />
        <Tab.Screen name='Search' component={SearchScreen} />
        <Tab.Screen name='Favourites' component={FavouritesScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default HomeBottomTabNavigator;