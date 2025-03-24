import GeneralForm  from "./general";
import VerifyForm from "./otp-form";
import { useAuthContext } from "./provider";

export const DisplayActiveForm = () => {
  const { flowState } = useAuthContext();
  switch (flowState) {
    case "verify":
      return <VerifyForm />;
    default:
      return <GeneralForm />;
  }
};
