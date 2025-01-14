import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useAtom, useSetAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import * as yup from "yup";

import Button from "src/components/common/Button";
import CustomTextInput from "src/components/common/CustomTextInput";
import Text from "../ui/Text";
import View from "../ui/View";

import { AxiosError } from "axios";
import navigate from "src/navigators/navigationRef";
import { apiConfig } from "src/services/apiConfig";
import { login } from "src/services/auth";
import {
  saveJWT,
  saveRefreshToken,
  setUserToStorage,
} from "src/services/store";
import { saveLastSeenRock } from "src/services/storeAsync";
import { providerUsedAtom, wantsToUseNotLoggedAtom } from "src/store/global";
import { HomeScreenNavigationProp } from "src/types/type";
import { removeFiles } from "src/utils/fileSystem";
import { GoogleIcon } from "../icons/Google";

export default function LoginPanel({
  googleIsLoading,
}: {
  googleIsLoading: boolean;
}) {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [providerUsed, setProviderUsed] = useAtom(providerUsedAtom);
  const setWantsToUseNotLogged = useSetAtom(wantsToUseNotLoggedAtom);
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending: isLoading,
    isError,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginData) => login(data.email, data.password),
    onError: async (data) => {
      if (data instanceof AxiosError) {
        const message = data.response?.data.error.message as string;
        if (
          typeof message === "string" &&
          message.toLowerCase().includes("email is not confirmed")
        ) {
          const formValues = getValues();
          navigation.navigate("Registered", {
            email: formValues.email,
            password: formValues.password,
          });
        }

        if (
          typeof message === "string" &&
          message.toLowerCase().includes("invalid identifier or password")
        ) {
          Toast.show({
            type: "error",
            text2: "Ten adres e-mail jest juz zajęty",
          });
          setError(
            "password",
            {
              message: "Adres e-mail lub hasło są niepoprawne",
            },
            {
              shouldFocus: true,
            },
          );
        }
      }
    },
    onSuccess: async (data) => {
      await saveJWT(data.jwt);
      await saveRefreshToken(data.refreshToken);
      await setUserToStorage(data.user);
      navigation.navigate("HomeNavigator", { email: "userEmail" });
    },
  });

  const { control, handleSubmit, getValues, setError } = useForm({
    defaultValues: {
      email: __DEV__ ? "test-user@test.com" : "",
      password: __DEV__ ? "Some-Password1" : "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: LoginData) => {
    mutate(data);
  };

  const handleGoogle = () => {
    if (providerUsed) {
      setProviderUsed(false);
    }
    Linking.openURL(encodeURI(apiConfig.auth.loginWGoogleIntent)).catch(
      (error) => {
        console.log(error);
      },
    );
  };

  const handleSkipLogin = () => {
    setWantsToUseNotLogged(true);
    navigate("HomeNavigator");
  };

  const handleCacheWipeout = () => {
    queryClient.clear();
    queryClient.cancelQueries();
    saveLastSeenRock(null);
  };

  const handleRemoveFiles = () => {
    removeFiles();
  };

  return (
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
      <View backgroundColor='backgroundScreen' paddingHorizontal='m'>
        <View alignItems='center'>
          <Text variant='h3' color='textBlack'>
            Zaloguj się i lecimy na wspin!
          </Text>
        </View>
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
            <View marginTop='l'>
              <Button
                label='Lecimy!'
                onClick={handleSubmit(onSubmitHandler)}
                isLoading={isLoading || googleIsLoading}
              />
            </View>
            <View justifyContent='center' alignItems='center' my='s'>
              <Text>lub</Text>
            </View>
            <TouchableOpacity onPress={handleGoogle}>
              <View justifyContent='center' alignItems='center'>
                <View
                  py='s'
                  borderColor='textSecondary'
                  borderWidth={1}
                  borderRadius={99}
                  flexDirection='row'
                  justifyContent='center'
                  alignItems='center'
                  gap='m'
                  width='100%'
                >
                  <GoogleIcon size={26} />
                  <View>
                    <Text>Zaloguj kontem Google</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View
              marginTop='l'
              justifyContent='center'
              alignItems='center'
              flexDirection='row'
            >
              <TouchableOpacity onPress={handleSkipLogin} hitSlop={20}>
                <View marginLeft='m'>
                  <Text variant='body' color='textSecondary'>
                    Kontynuuj bez logowania
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
              <TouchableOpacity
                onPress={() => navigation.navigate("ResetPassword")}
                hitSlop={20}
              >
                <View marginLeft='m'>
                  <Text variant='body' color='textSecondary'>
                    Nie pamiętasz hasła?
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
                Nie masz konta?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                hitSlop={20}
              >
                <View marginLeft='m'>
                  <Text variant='body' color='textSecondary'>
                    Zarejestruj się
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {__DEV__ && (
              <View
                borderColor='backgroundDark'
                borderRadius={24}
                borderWidth={1}
                marginTop='l'
                padding='m'
              >
                <Text variant='h4' color='textSecondary'>
                  Dev only:
                </Text>
                <TouchableOpacity onPress={handleCacheWipeout}>
                  <Text variant='body' color='textSecondary'>
                    - Wipe out query cache
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveFiles}>
                  <Text variant='body' color='textSecondary'>
                    - Wipe out all stored saved image files
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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

export type LoginData = yup.InferType<typeof schema>;
