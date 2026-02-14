import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { useMessageActions } from "../../toaster/MessageHooks";
import {
  RegisterPresenter,
  RegisterView,
} from "../../../presenter/RegisterPresenter";
import { AuthToken, User } from "tweeter-shared";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageStringBase64, setImageStringBase64] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const view: RegisterView = useMemo(
    () => ({
      setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
      navigate: (url: string) => navigate(url),
      displayErrorMessage: (message: string) => displayErrorMessage(message),
      updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        rememberMe: boolean
      ) =>
        updateUserInfo(currentUser, displayedUser, authToken, rememberMe),
    }),
    [navigate, updateUserInfo, displayErrorMessage]
  );

  const presenter = useMemo(() => new RegisterPresenter(view), [view]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageStringBase64(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkSubmitButtonStatus = (): boolean => {
    return !firstName || !lastName || !alias || !password || !image;
  };

  const doRegister = async () => {
    if (imageStringBase64) {
      await presenter.doRegister(
        firstName,
        lastName,
        alias,
        password,
        imageStringBase64,
        rememberMe
      );
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="firstName">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
          <label htmlFor="lastName">Last Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="alias"
            placeholder="name@example.com"
            onChange={(e) => setAlias(e.target.value)}
          />
          <label htmlFor="alias">Alias</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Profile Image
          </label>
          <input
            className="form-control"
            type="file"
            id="image"
            onChange={handleFileChange}
          />
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;