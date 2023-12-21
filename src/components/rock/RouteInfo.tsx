import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useAtom, useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { LayoutAnimation, TextInput, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import Toast from "react-native-toast-message";

import Accordion from "src/components/common/Accordion";
import Backdrop from "src/components/common/Backdrop";
import Button from "src/components/common/Button";
import Rating from "src/components/common/Rating";
import OverlayCardView from "src/components/ui/OverlayCardView";
import Text from "src/components/ui/Text";
import View from "src/components/ui/View";

import { RoutesParent } from "src/components/common/ResultsItem/ResultsItemRoute";
import { CommentIcon } from "src/components/icons/Comment";
import { HeartIcon } from "src/components/icons/Heart";
import { useFavoriteContext } from "src/context/FavoritesContext";
import { useUserProfile } from "src/hooks/useUserProfile";
import { Route, createComment, updateComment } from "src/services/rocks";
import { confirmActionAtom } from "src/store/global";
import { selectedRouteToRateAtom } from "src/store/results";
import { rockActiveRoute, routeToFavoritesAtom } from "src/store/rock";
import { styleGuide } from "src/styles/guide";
import { Theme } from "src/styles/theme";
import { getFavoriteColor } from "src/utils/getFavoriteColor";
import { getAnchorName } from "src/utils/language/getAnchorName";
import { getMeaningfulGrade } from "src/utils/language/getMeaningfulGrade";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type RockInfoProps = {
  route: Route;
  realIndex?: number;
  rockRefetch: () => void;
  parent: RoutesParent;
};

const RouteInfo = ({
  route,
  realIndex,
  rockRefetch,
  parent,
}: RockInfoProps) => {
  const { colors } = useTheme<Theme>();

  const commentsBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [activeRoute, setActiveRoute] = useAtom(rockActiveRoute);
  const setRouteToFavorites = useSetAtom(routeToFavoritesAtom);
  const setConfirmAction = useSetAtom(confirmActionAtom);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(false);
  const { data: userData } = useUserProfile();
  const { checkRouteInFavorites, removeRouteFromFavorites } =
    useFavoriteContext();
  const favoriteType = checkRouteInFavorites(route.attributes.uuid);
  const [selectedRouteToRate, setSelectedRouteToRate] = useAtom(
    selectedRouteToRateAtom,
  );

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (activeRoute === route.attributes.uuid) return setActiveRoute(null);
    setActiveRoute(route.attributes.uuid);
  };

  const { mutate: sendCommentMutation } = useMutation({
    mutationFn: () =>
      createComment(selectedRouteToRate?.id || -1, comment, userData?.id),
    onSuccess: () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setEditingComment(false);
      Toast.show({
        type: "success",
        text2: "Komentarz został zapisany",
      });
      rockRefetch();
      setTimeout(() => dismissBottomSheet(), 200);
    },
    onError: (err: AxiosError) => {
      if (err?.response?.status === 406) {
        Toast.show({
          type: "error",
          text2: "Ten komentarz nie spełnia standardów społeczności",
        });
      } else {
        Toast.show({
          type: "error",
          text2: "Coś poszło nie tak",
        });
      }
    },
  });

  const { mutate: updateCommentMutation } = useMutation({
    mutationFn: () => updateComment(route.attributes.usersComment?.id, comment),
    onSuccess: (data) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      rockRefetch();
      Toast.show({
        type: "success",
        text2: "Komentarz został zaktualizowany",
      });
      setTimeout(() => dismissBottomSheet(), 200);
    },
    onError: (err: AxiosError) => {
      if (err?.response?.status === 406) {
        Toast.show({
          type: "error",
          text2: "Ten komentarz nie spełnia standardów społeczności",
        });
      } else {
        Toast.show({
          type: "error",
          text2: "Coś poszło nie tak",
        });
      }
    },
  });

  const handleCommentRoute = (route: Route) => {
    if (route.attributes.usersComment)
      setComment(route.attributes.usersComment.comment);
    setSelectedRouteToRate(route);
    commentsBottomSheetModalRef.current?.present();
  };

  const handleSendCommentButton = () => {
    if (
      route.attributes.usersComment &&
      editingComment &&
      comment.length > 5 &&
      route.attributes.usersComment.comment !== comment
    ) {
      return updateCommentMutation();
    }
    if (route.attributes.usersComment && !editingComment)
      return setEditingComment(true);
    if (
      route.attributes.usersComment &&
      route.attributes.usersComment.comment.toLowerCase() ===
        comment.toLowerCase()
    ) {
      return setEditingComment(false);
    }
    if (comment.length > 5) sendCommentMutation();
  };

  const dismissBottomSheet = () => {
    setSelectedRouteToRate(null);
    setComment("");
    setEditingComment(false);
    commentsBottomSheetModalRef.current?.dismiss();
  };

  const handleFavoritesPress = () => {
    if (!favoriteType) return setRouteToFavorites({ route, parent });
    if (favoriteType) {
      return setConfirmAction({
        confirmFn: () => removeRouteFromFavorites(route),
        message: `Usuwasz drogę ${route.attributes.display_name} z zapisanych`,
      });
    }
  };

  const handleRateRoute = () => {
    setSelectedRouteToRate(route);
  };

  const commentsSnapPoints = useMemo(() => ["80%"], []);
  return (
    <>
      <AnimatedTouchableOpacity
        key={route.attributes.uuid}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <Accordion
          Title={
            <View
              flexDirection='row'
              justifyContent='space-between'
              flex={1}
              alignItems='center'
            >
              <View flexDirection='row' alignItems='center'>
                <View flexBasis={30} marginLeft='xs' borderColor='secondary'>
                  <Text variant='h2' color={colors.secondary}>
                    {(realIndex! + 1).toString()}
                  </Text>
                </View>
                <View gap='s'>
                  <Text variant='h3'>{route.attributes.display_name}</Text>
                  <View flexDirection='row' gap='m'>
                    <Text
                      variant='h4'
                      color={colors.secondary}
                      additionalStyles={{ width: 40 }}
                    >
                      {getMeaningfulGrade(route.attributes.grade)}
                    </Text>
                    <Text variant='body'>{route.attributes.Type}</Text>
                  </View>
                </View>
              </View>
              <View flexDirection='row' gap='l' alignItems='center'>
                <View justifyContent='center'>
                  <Rating
                    rating={route.attributes.averageScore.toString()}
                    noFill
                  />
                </View>
                <TouchableOpacity onPress={handleFavoritesPress}>
                  <OverlayCardView
                    padding='xs'
                    backgroundColor='mainBackground'
                    width={46}
                    height={46}
                    justifyContent='center'
                    alignItems='center'
                  >
                    <HeartIcon
                      fill={getFavoriteColor(favoriteType)}
                      color={colors.secondary}
                      size={32}
                      noStroke={!!favoriteType}
                    />
                  </OverlayCardView>
                </TouchableOpacity>
              </View>
            </View>
          }
          Content={
            route.attributes.uuid === activeRoute && (
              <View
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <View gap='s' maxWidth='75%'>
                  <View flexDirection='row' gap='s' alignItems='center'>
                    <Text variant='h3'>Przelotów:</Text>
                    <Text>{route.attributes.rings_number.toString()}</Text>
                  </View>
                  <View flexDirection='row' gap='s' alignItems='center'>
                    <Text variant='h3'>Stan:</Text>
                    <Text>{getAnchorName(route.attributes.anchor)}</Text>
                  </View>

                  {route.attributes.author && (
                    <View flexDirection='row' gap='s' alignItems='center'>
                      <Text variant='h3'>Autor:</Text>
                      <Text>{route.attributes.author}</Text>
                      <Text>{route.attributes.author_date.toString()}</Text>
                    </View>
                  )}
                  {route.attributes.first_ascent_author && (
                    <View flexDirection='row' gap='s' alignItems='center'>
                      <Text variant='h3'>1. przejście:</Text>
                      <Text>{route.attributes.first_ascent_author}</Text>
                    </View>
                  )}
                  {route.attributes.description && (
                    <View>
                      <Text>{route.attributes.description}</Text>
                    </View>
                  )}
                </View>
                <View justifyContent='space-between' gap='m'>
                  <TouchableOpacity onPress={() => handleRateRoute()}>
                    <OverlayCardView
                      width={46}
                      height={46}
                      justifyContent='center'
                      alignItems='center'
                    >
                      <Rating
                        rating={
                          route.attributes.usersRating
                            ? route.attributes.usersRating.score.toString()
                            : null
                        }
                      />
                    </OverlayCardView>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCommentRoute(route)}>
                    <OverlayCardView
                      width={46}
                      height={46}
                      justifyContent='center'
                      alignItems='center'
                    >
                      <CommentIcon
                        size={36}
                        color={
                          route.attributes.usersComment
                            ? colors.mainBackground
                            : colors.backgroundBlack
                        }
                        fill={
                          route.attributes.usersComment
                            ? colors.secondary
                            : colors.mainBackground
                        }
                      />
                    </OverlayCardView>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        />
      </AnimatedTouchableOpacity>

      <BottomSheetModal
        ref={commentsBottomSheetModalRef}
        index={0}
        snapPoints={commentsSnapPoints}
        onDismiss={dismissBottomSheet}
        enableDismissOnClose
        style={styleGuide.bottomSheet}
        backdropComponent={Backdrop}
      >
        <BottomSheetScrollView>
          <View padding='m' gap='m'>
            <View alignItems='center'>
              <Text variant='h2'>
                {selectedRouteToRate?.attributes.display_name}
              </Text>
            </View>
            <OverlayCardView backgroundColor='mainBackground'>
              <View borderBottomWidth={0.3} marginBottom='m' paddingBottom='s'>
                <Text variant='special'>Twój komentarz:</Text>
              </View>
              {route.attributes.usersComment && !editingComment ? (
                <View>
                  <Text>{route.attributes.usersComment.comment}</Text>
                </View>
              ) : (
                <TextInput
                  style={$commentInput}
                  defaultValue={comment}
                  onChangeText={(text) => setComment(text)}
                  multiline
                  numberOfLines={2}
                  underlineColorAndroid='transparent'
                />
              )}
              <Button
                label={
                  route.attributes.usersComment && !editingComment
                    ? "Edytuj komentarz"
                    : "Zapisz"
                }
                onClick={handleSendCommentButton}
              />
            </OverlayCardView>
            {Array.isArray(route.attributes.comments) &&
            route.attributes.comments.length >= 1 ? (
              route.attributes.comments.slice(0, 10).map((comment) => (
                <OverlayCardView
                  key={comment.id}
                  backgroundColor='mainBackground'
                >
                  <View gap='m'>
                    <View
                      flexDirection='row'
                      justifyContent='space-between'
                      borderBottomWidth={0.3}
                      paddingBottom='s'
                    >
                      <Text variant='special'>{comment.user}</Text>
                      <Text variant='special'>
                        {dayjs(comment.updatedAt).format("YYYY/MM/DD")}
                      </Text>
                    </View>
                    <Text>{comment.comment}</Text>
                  </View>
                </OverlayCardView>
              ))
            ) : (
              <Text>
                {route.attributes.usersComment
                  ? "Brak innych komentarzy dla tej drogi"
                  : "Brak komentarzy dla tej drogi."}
              </Text>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

const $commentInput = {
  minHeight: 56,
  lineHeight: 16,
  padding: 12,
  borderWidth: 1,
  borderRadius: 12,
  paddingBottom: 32,
};

export default RouteInfo;
