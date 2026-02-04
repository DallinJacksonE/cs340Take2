import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../toaster/MessageHooks";

interface Props {
  name: string;
  id: string;
  icon: [IconPrefix, IconName];
}
const OAuth = (props: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(
      message,
      3000,
      "text-white bg-primary"
    );
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-link btn-floating mx-1"
        onClick={() =>
          displayInfoMessageWithDarkBackground(
            `${props.name} registration is not implemented.`
          )
        }
      >
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={props.id}>{props.name}</Tooltip>}
        >
          <FontAwesomeIcon icon={props.icon} />
        </OverlayTrigger>
      </button>
    </>
  );
}

export default OAuth;
