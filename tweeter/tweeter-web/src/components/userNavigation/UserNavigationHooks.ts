import { useNavigate } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";

interface UserNavigationActions {
  navigateToUser: (event: React.MouseEvent) => Promise<void>,
  extractAlias: (value: string) => string,
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>
}

const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
  const { displayErrorMessage } = useMessageActions();
  const { setDisplayedUser } = useUserInfoActions();
  const { authToken, displayedUser } = useUserInfo();

  const navigate = useNavigate();
  event.preventDefault();

  try {
    const alias = extractAlias(event.target.toString());
    const featurePath = extractFeaturePath(event.target.toString());

    const toUser = await getUser(authToken!, alias);

    if (toUser) {
      if (!toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    }
  } catch (error) {
    displayErrorMessage(
      `Failed to get user because of exception: ${error}`,
    );
  }
};

const extractAlias = (value: string): string => {
  const index = value.indexOf("@");
  return value.substring(index);
};

const extractFeaturePath = (value: string): string => {
  console.log(value);
  return value
}

const getUser = async (
  authToken: AuthToken,
  alias: string
): Promise<User | null> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.findUserByAlias(alias);
};


export const useUserNavigationActions = (): UserNavigationActions => {
  return {
    navigateToUser: (event: React.MouseEvent) => navigateToUser(event),
    extractAlias: (value: string) => extractAlias(value),
    getUser: (authToken: AuthToken, alias: string) => getUser(authToken, alias)
  };
}





