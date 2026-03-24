import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/AuthenticationPresenters/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  let mockPresenter: LoginPresenter;
  let mockPresenterInstance: LoginPresenter;

  beforeEach(() => {
    mockPresenter = mock<LoginPresenter>();
    mockPresenterInstance = instance(mockPresenter);
    when(
      mockPresenter.checkSubmitButtonStatus(anything(), anything()),
    ).thenCall((alias: string, password: string) => {
      return !alias || !password;
    });
    when(
      mockPresenter.doLogin(anything(), anything(), anything(), anything()),
    ).thenResolve();
  });

  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement(
      "/",
      mockPresenterInstance,
    );
    expect(signInButton).toBeDisabled();
  });

  it("enables sign in when both alias and password have text", () => {
    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/", mockPresenterInstance);

    // Synchronously change values without await
    fireEvent.change(aliasField, { target: { value: "testAlias" } });
    fireEvent.change(passwordField, { target: { value: "testPassword" } });

    expect(signInButton).toBeEnabled();
  });

  it("disables sign in if either field is cleared", () => {
    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/", mockPresenterInstance);

    fireEvent.change(aliasField, { target: { value: "testAlias" } });
    fireEvent.change(passwordField, { target: { value: "testPassword" } });

    expect(signInButton).toBeEnabled();

    // clear alias
    fireEvent.change(aliasField, { target: { value: "" } });
    expect(signInButton).toBeDisabled();

    fireEvent.change(aliasField, { target: { value: "testAlias" } });
    expect(signInButton).toBeEnabled();

    // clear password
    fireEvent.change(passwordField, { target: { value: "" } });
    expect(signInButton).toBeDisabled();

    fireEvent.change(passwordField, { target: { value: "testPassword" } });
    expect(signInButton).toBeEnabled();
  });

  it("calls presenters login method with right parameters when sign in is pressed", async () => {
    const originalURL = "https://fromSomewhereElse.domainish";
    const alias = "@testAlias";
    const password = "testPassword";

    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElement(originalURL, mockPresenterInstance);

    fireEvent.change(aliasField, { target: { value: alias } });
    fireEvent.change(passwordField, { target: { value: password } });

    // Use fireEvent for the click as well
    fireEvent.click(signInButton);

    await waitFor(() => {
      verify(mockPresenter.doLogin(alias, password, false, originalURL)).once();
    });
  });

  it("calls presenters login method with right parameters when Enter key is pressed", async () => {
    const originalURL = "https://fromSomewhereElse.domainish";
    const alias = "@testAlias";
    const password = "testPassword";

    const { aliasField, passwordField } = renderLoginAndGetElement(
      originalURL,
      mockPresenterInstance,
    );

    fireEvent.change(aliasField, { target: { value: alias } });
    fireEvent.change(passwordField, { target: { value: password } });

    fireEvent.keyDown(passwordField, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      verify(mockPresenter.doLogin(alias, password, false, originalURL)).once();
    });
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
  // Completely removed userEvent.setup()
  renderLogin(originalURL, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  // No longer returning 'user'
  return { signInButton, aliasField, passwordField };
}
