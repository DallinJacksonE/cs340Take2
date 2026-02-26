import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../../toaster/MessageHooks";
import {
  LoginPresenter,
  LoginView,
} from "../../../presenter/AuthenticationPresenters/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const view: LoginView = useMemo(
    () => ({
      setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
      navigate: (url: string) => navigate(url),
      displayErrorMessage: (message: string) => displayErrorMessage(message),
      updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        rememberMe: boolean,
      ) => updateUserInfo(currentUser, displayedUser, authToken, rememberMe),
    }),
    [navigate, updateUserInfo, displayErrorMessage],
  );

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenter ?? new LoginPresenter(view);
  }
  const presenter = presenterRef.current;

  const doLogin = async () => {
    await presenter.doLogin(alias, password, rememberMe, props.originalUrl);
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.key == "Enter" &&
      !presenter.checkSubmitButtonStatus(alias, password)
    ) {
      doLogin();
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          onClick={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() =>
        presenter.checkSubmitButtonStatus(alias, password)
      }
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
