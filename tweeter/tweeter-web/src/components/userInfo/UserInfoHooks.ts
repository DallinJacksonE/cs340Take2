import { useContext } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";


export const useUserInfo = () => {
  return useContext(UserInfoContext);
}

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
}
