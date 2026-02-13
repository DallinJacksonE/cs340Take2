import { useNavigate } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserNaviagtionPresenter, UserNaviagtionView } from "../../presenter/UserNavigationPresenter";

interface UserNavigationActions {
  navigateToUser: (event: React.MouseEvent) => Promise<void>,
  extractAlias: (value: string) => string,
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>
}

export const useUserNavigationActions = (): UserNavigationActions => {
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const presenterListener: UserNaviagtionView = {
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
    displayedUser: displayedUser!,
    authToken: authToken!,
  }

  const presenter = new UserNaviagtionPresenter(presenterListener);

  return {
    navigateToUser: (event: React.MouseEvent) => presenter.navigateToUser(event),
    extractAlias: (value: string) => presenter.extractAlias(value),
    getUser: (authToken: AuthToken, alias: string) => presenter.getUser(authToken, alias)
  }
}



