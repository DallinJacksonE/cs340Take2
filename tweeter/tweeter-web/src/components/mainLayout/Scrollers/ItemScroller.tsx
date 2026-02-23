import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { useUserNavigationActions } from "../../userNavigation/UserNavigationHooks";
import { PagedPresenterView } from "../../../presenter/PagedPresenters/PagedPresenter";
import { PagedPresenter } from "../../../presenter/PagedPresenters/PagedPresenter";

interface Props<T, P extends PagedPresenter<T, any>> {
  presenterFactory: (view: PagedPresenterView<T>) => P;
  renderItem: (item: T) => JSX.Element;
}

const ItemScroller = <T, P extends PagedPresenter<T, any>>(
  props: Props<T, P>,
) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const { getUser } = useUserNavigationActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // Define the listener for the presenter
  const listener: PagedPresenterView<T> = {
    addItems: (newItems: T[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };

  // Initialize the presenter using a ref to persist it across renders
  const presenterRef = useRef<P | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  // Update the displayed user context variable whenever the displayedUser url parameter changes.
  // This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser!.alias
    ) {
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    if (authToken && displayedUser) {
      presenterRef.current!.loadMoreItems(authToken, displayedUser);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.renderItem(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
