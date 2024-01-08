import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import Button from "src/components/common/Button";
import CustomTextInput from "src/components/common/CustomTextInput";
import Text from "../ui/Text";
import View from "../ui/View";

import { login } from "src/services/auth";
import {
  saveJWT,
  saveRefreshToken,
  setUserToStorage,
} from "src/services/store";
import { HomeScreenNavigationProp } from "src/types/type";

export default function LoginPanel() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { height } = useWindowDimensions();
  const { mutate, isLoading, isError } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginData) => login(data.email, data.password),
    onSuccess: async (data) => {
      await saveJWT(data.jwt);
      await saveRefreshToken(data.refreshToken);
      await setUserToStorage(data.user);
      navigation.navigate("HomeNavigator");
    },
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "mikel@gg.pl",
      password: "mikel1",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: LoginData) => {
    mutate(data);
  };

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View
        height={height}
        backgroundColor='backgroundScreen'
        paddingHorizontal='m'
      >
        <Text variant='h2' color='textGray'>
          Topo na wyciągnięcie ręki
        </Text>
        <View marginTop='xl' justifyContent='space-between' flexGrow={1}>
          <View>
            <Controller
              control={control}
              name='email'
              rules={{ required: true }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  hookBlurHandler={onBlur}
                  onChange={(value) => onChange(value)}
                  value={value}
                  label='Adres e-mail'
                  error={error}
                  autoComplete='email'
                />
              )}
            />
            <View marginTop='m'>
              <Controller
                control={control}
                name='password'
                rules={{ required: true }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <CustomTextInput
                    hookBlurHandler={onBlur}
                    onChange={(value) => onChange(value)}
                    value={value}
                    label='Hasło'
                    error={error}
                    secure
                  />
                )}
              />
            </View>
            <View marginTop='m'>
              <Button
                label='Zaloguj'
                onClick={handleSubmit(onSubmitHandler)}
                isLoading={isLoading}
              />
            </View>
            {isError && (
              <Button
                label='Uzywaj w trybie offline'
                onClick={() => navigation.navigate("Home")}
              />
            )}
            <View
              marginTop='l'
              justifyContent='center'
              alignItems='center'
              flexDirection='row'
            >
              <Text variant='body' color='textGray'>
                Nie masz konta?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                hitSlop={20}
              >
                <View marginLeft='m'>
                  <Text variant='body' color='textSecondary'>
                    Zarejestruj
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              marginTop='l'
              justifyContent='center'
              alignItems='center'
              flexDirection='row'
            >
              <Text variant='body' color='textGray'>
                Zapomniałeś hasła?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ResetPassword")}
                hitSlop={20}
              >
                <View marginLeft='m'>
                  <Text variant='body' color='textSecondary'>
                    Resetuj hasło tutaj
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Wpisz poprawny adres e-mail")
    .required("Wpisz adres e-mail"),
  password: yup
    .string()
    .min(6, "Hasło powinno mieć co najmniej 6 znaków")
    .max(32, "Hasło jest zbyt długie")
    .required("Wpisz hasło"),
});

type LoginData = yup.InferType<typeof schema>;
