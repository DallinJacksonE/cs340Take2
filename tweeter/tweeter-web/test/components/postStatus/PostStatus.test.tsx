import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { User } from "tweeter-shared/src/model/domain/User";
import { AuthToken } from "tweeter-shared/src/model/domain/AuthToken";
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

  let mockPresenter: PostStatusPresenter;
  let mockPresenterInstance: PostStatusPresenter;

  beforeAll(async () => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  beforeEach(() => {
    mockPresenter = mock<PostStatusPresenter>();
    mockPresenterInstance = instance(mockPresenter);
    when(mockPresenter.checkButtonStatus(anything())).thenCall(
      (post: string) => {
        return post.length === 0;
      },
    );
  });

  it("has both submit and clear buttons disabled with no input", () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", () => {
    const { postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    expectedButtonBehaviorWithInputText(
      postStatusButton,
      clearStatusButton,
      textBox,
    );
  });

  it("disables both buttons when text has been cleared", () => {
    const { postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    expectedButtonBehaviorWithInputText(
      postStatusButton,
      clearStatusButton,
      textBox,
    );

    // Use fireEvent to clear synchronously
    fireEvent.change(textBox, { target: { value: "" } });

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls presenters clearPost method when clear button is pressed", async () => {
    const { postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    expectedButtonBehaviorWithInputText(
      postStatusButton,
      clearStatusButton,
      textBox,
    );

    // Click synchronously
    fireEvent.click(clearStatusButton);

    // Wait for the mock to register the clear call
    await waitFor(() => {
      verify(mockPresenter.clearPost()).once();
    });
  });

  it("calls presenters postStatus method with correct parameters Post Status button pressed", async () => {
    const { postStatusButton, clearStatusButton, textBox } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    expectedButtonBehaviorWithInputText(
      postStatusButton,
      clearStatusButton,
      textBox,
    );

    // Click synchronously
    fireEvent.click(postStatusButton);

    // Wait for the mock to register the submit call
    await waitFor(() => {
      verify(mockPresenter.submitPost("testing textbox")).once();
    });
  });
});

// Notice this is no longer an async function since fireEvent is completely synchronous
function expectedButtonBehaviorWithInputText(
  postStatusButton: HTMLElement,
  clearStatusButton: HTMLElement,
  textBox: HTMLElement,
) {
  fireEvent.change(textBox, { target: { value: "testing textbox" } });
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
  // Completely removed userEvent.setup()
  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("postStatusButton");
  const clearStatusButton = screen.getByLabelText("clearStatusButton");
  const textBox = screen.getByLabelText("post-status-text-box");

  // No longer returning 'user'
  return { postStatusButton, clearStatusButton, textBox };
}
