import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import Button from "src/components/common/Button";
import CustomTextInput, {
  AutoComplete,
} from "src/components/common/CustomTextInput";
import Text from "../ui/Text";
import View from "../ui/View";

import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { RegisterResponseError, register } from "src/services/auth";
import { saveJWT, setUserToStorage } from "src/services/store";
import { HomeScreenNavigationProp } from "src/types/type";

export default function RegisterPanel() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { height } = useWindowDimensions();

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterData) =>
      register(data.username, data.email, data.password),
    onSuccess: (data) => {
      saveJWT(data.data.jwt);
      setUserToStorage(data.data.user);
      const formValues = getValues();
      navigation.navigate("Registered", {
        email: formValues.email,
        password: formValues.password,
      });
    },
    onError(error, variables, context) {
      const axiosError = error as AxiosError<RegisterResponseError>;
      if (
        axiosError.response?.data.error.message.toLowerCase() ===
        "Email or Username are already taken".toLowerCase()
      ) {
        Toast.show({
          type: "error",
          text2: "Ten adres e-mail jest juz zajęty",
        });
      }
    },
  });

  const { control, handleSubmit, getValues } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: RegisterData) => {
    mutate(data);
  };

  const inputs = [
    {
      label: "Adres e-mail",
      field: "email",
      others: { autoComplete: "email" as AutoComplete },
    },
    {
      label: "Nazwa użytkownika",
      field: "username",
    },
    {
      label: "Hasło",
      field: "password",
      others: { secure: true },
    },
  ];

  const handleOpenPrivacy = () => {
    Linking.openURL("https://wspinapp.pl/policy").catch((error) => {
      console.log(error);
    });
  };

  return (
    <KeyboardAwareScrollView>
      <View paddingHorizontal='m' backgroundColor='backgroundScreen'>
        <View alignItems='center' mb='l'>
          <Text variant='h3' color='textBlack'>
            {"Chcesz do nas dołączć - no i fajnie :) "}
          </Text>
        </View>
        <View gap='l'>
          {inputs.map((input) => (
            <Controller
              key={input.field}
              control={control}
              name={input.field as keyof RegisterData}
              rules={{ required: true }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <CustomTextInput
                  hookBlurHandler={onBlur}
                  onChange={(value) => onChange(value)}
                  value={value}
                  label={input.label}
                  error={error}
                  {...input.others}
                />
              )}
            />
          ))}
          <View mb='s'>
            <Text variant='body' color='textBlack'>
              Na Twój adres e-mail wyślemy wiadomość z linkiem, którym
              potwierdzisz rejestrację. Zwykle trwa to do kilku minut.
            </Text>
          </View>
          <Button
            label='Zarejestruj'
            onClick={handleSubmit(onSubmitHandler)}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </View>
        <View
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          marginTop='l'
        >
          <Text color='textBlack' variant='body'>
            Masz już konto?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            hitSlop={20}
          >
            <View marginLeft='s'>
              <Text
                variant='body'
                additionalStyles={{ fontFamily: "Outfit600" }}
                color='textSecondary'
              >
                Wróć do logowania
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View marginTop='m'>
          <View justifyContent='center' alignItems='center'>
            <Text color='textBlack' variant='body'>
              Rejestrując się akceptujesz
            </Text>
          </View>
          <View justifyContent='center' alignItems='center' flexDirection='row'>
            <TouchableOpacity
              onPress={() => console.log("open terms")}
              hitSlop={20}
            >
              <Text
                additionalStyles={{
                  textDecorationStyle: "solid",
                  fontFamily: "Outfit600",
                }}
                variant='body'
                color='textSecondary'
              >
                Regulamin
              </Text>
            </TouchableOpacity>

            <Text variant='body'> i </Text>
            <TouchableOpacity onPress={handleOpenPrivacy} hitSlop={20}>
              <Text
                additionalStyles={{
                  textDecorationStyle: "solid",
                  fontFamily: "Outfit600",
                }}
                variant='body'
                color='textSecondary'
              >
                Politykę Prywatności.
              </Text>
            </TouchableOpacity>
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
  username: yup
    .string()
    .min(4, "Nazwa musi mieć 4 znaki")
    .max(32, "Nazwa jest zbyt długa")
    .required("Wpisz adres e-mail"),
  password: yup
    .string()
    .min(6, "Hasło powinno mieć co najmniej 6 znaków")
    .max(32, "Hasło jest zbyt długie")
    .required("Wpisz hasło"),
});

export type RegisterData = yup.InferType<typeof schema>;
