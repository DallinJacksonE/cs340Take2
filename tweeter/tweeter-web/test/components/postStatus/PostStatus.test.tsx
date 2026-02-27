import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { User } from "tweeter-shared/src/model/domain/User";
import { AuthToken } from "tweeter-shared/src/model/domain/AuthToken";
import { userEvent } from "@testing-library/user-event";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Test Suite", () => {
  const mockUser = mock<User>();
  const mockUserInstance = instance(mockUser);

  const mockAuthToken = mock<AuthToken>();
  const mockAuthTokenInstance = instance(mockAuthToken);
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("has both submit and clear buttons disabled with no input", () => {
    const { user, postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement();

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { user, postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement();

    await expectedButtonBehaviorWithInputText(
      user,
      postStatusButton,
      clearStatusButton,
      textBox,
    );
  });

  it("disables both buttons when text has been cleared", async () => {
    const { user, postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement();

    await expectedButtonBehaviorWithInputText(
      user,
      postStatusButton,
      clearStatusButton,
      textBox,
    );

    await user.clear(textBox);

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("clear button clears text and buttons disable", async () => {
    const { user, postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement();

    await expectedButtonBehaviorWithInputText(
      user,
      postStatusButton,
      clearStatusButton,
      textBox,
    );

    await user.click(clearStatusButton);

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls presenters postStatus method with correct parameters Post Status button pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { user, postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await expectedButtonBehaviorWithInputText(
      user,
      postStatusButton,
      clearStatusButton,
      textBox,
    );

    await user.click(postStatusButton);

    verify(mockPresenter.submitPost("testing textbox")).once();
  });
});

async function expectedButtonBehaviorWithInputText(
  user: any,
  postStatusButton: HTMLElement,
  clearStatusButton: HTMLElement,
  textBox: HTMLElement,
) {
  await user.type(textBox, "testing textbox");
  expect(postStatusButton).toBeEnabled();
  expect(clearStatusButton).toBeEnabled();
}

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      <PostStatus presenter={presenter} />
    </MemoryRouter>,
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("postStatusButton");
  const clearStatusButton = screen.getByLabelText("clearStatusButton");

  const textBox = screen.getByLabelText("post-status-text-box");

  return { user, postStatusButton, clearStatusButton, textBox };
}
