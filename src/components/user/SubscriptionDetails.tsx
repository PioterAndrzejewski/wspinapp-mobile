import dayjs from "dayjs";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import PaymentModal from "src/components/home/rock/PaymentModal";
import Card from "src/components/ui/Card";
import Text from "src/components/ui/Text";
import View from "src/components/ui/View";

import { useUserProfile } from "src/hooks/useUserProfile";

const SubscriptionDetails = () => {
  const user = useUserProfile();
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);

  const currentDate = dayjs();
  const subscriptionDate = dayjs(Number(user.data?.subscriptionTo));

  const renderSubscriptionData = () => (
    <>
      <Text>
        Subskrypcja do:{" "}
        {dayjs(Number(user.data?.subscriptionTo)).format("DD/MM/YYYY")}
      </Text>
      {dayjs().isBefore(subscriptionDate) ? (
        <Text>
          Ważna jeszcze {subscriptionDate.diff(currentDate, "day")} dni
        </Text>
      ) : (
        <Text>
          Wygasła {-subscriptionDate.diff(currentDate, "day")} dni temu
        </Text>
      )}
    </>
  );

  const renderLackOfSubscription = () => (
    <View gap='m'>
      <View flexDirection='row' gap='s'>
        <Text variant='h3'>Subskrypcja: </Text>
        <Text>brak</Text>
      </View>
      <TouchableOpacity onPress={() => setPaymentModalOpened(true)}>
        <View
          alignItems='center'
          paddingHorizontal='l'
          backgroundColor='backgroundLight'
          paddingVertical='s'
          borderRadius={24}
        >
          <Text variant='body' color='textBlack'>
            Wykup subskrypcję
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Card title='Subskrypcja' marginHorizontal='m' isOutline>
        {user.data?.subscriptionTo
          ? renderSubscriptionData()
          : renderLackOfSubscription()}
      </Card>
      {paymentModalOpened && (
        <PaymentModal
          opened={paymentModalOpened}
          onClose={() => setPaymentModalOpened(false)}
        />
      )}
    </>
  );
};

export default SubscriptionDetails;
