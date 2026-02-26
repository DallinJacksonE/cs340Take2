import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/AuthenticationPresenters/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables sign in when both alias and password have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");
    await user.type(aliasField, "testAlias");
    await user.type(passwordField, "testPassword");

    expect(signInButton).toBeEnabled();
  });

  it("disables sign in if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");
    await user.type(aliasField, "testAlias");
    await user.type(passwordField, "testPassword");

    expect(signInButton).toBeEnabled();

    //clear alias
    await user.clear(aliasField);

    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "testAlias");

    expect(signInButton).toBeEnabled();

    //clear passwrod
    await user.clear(passwordField);

    expect(signInButton).toBeDisabled();

    await user.type(passwordField, "testPassword");

    expect(signInButton).toBeEnabled();
  });

  it("calls presenters login method with right parameters when sign in is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalURL = "https://fromSomewhereElse.domainish";
    const alias = "@testAlias";
    const password = "testPassword";

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement(originalURL, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);
    verify(mockPresenter.doLogin(alias, password, false, originalURL)).once();
  });
});

function renderLogin(originalURL: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalURL} presenter={presenter} />
      ) : (
        <Login originalUrl={originalURL} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  originalURL: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();
  renderLogin(originalURL, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
