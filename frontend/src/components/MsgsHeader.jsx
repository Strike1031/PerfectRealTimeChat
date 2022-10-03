import { ArrowBack, Close } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { selectAppState } from "../store/slices/AppSlice";
import { getOneToOneChatReceiver, truncateString } from "../utils/appUtils";

const MsgsHeader = ({
  closeChat,
  openTeamInfoDialog,
  openGroupInfoDialog,
  openDiscussInfoDialog,
  openViewProfileDialog,
  hideEmojiPicker,
  CustomTooltip,
}) => {
  const { loggedInUser, selectedChat } = useSelector(selectAppState);
  const chatType = selectedChat?.isGroupChat;
  console.log(chatType);
  

  const renderInfoSwitch = (chatType) => {
    switch (chatType) {
      case '0':
        return 'View Profile';
      case '1':
        return 'Team Info';
      case '2':
        return 'Group Info';
      case '3':
        return 'Discuss Info';
      default:
        return 'none';
    }
  };

  const renderNameSwitch = (chatType) => {
    switch (chatType) {
      case '0':
        return getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.name;
      case '1':
        return selectedChat?.chatName;
      case '2':
        return selectedChat?.chatName;
      case '3':
        return selectedChat?.chatName;
      default:
        return getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.name;
    }
  };
  const chatName = renderNameSwitch(chatType);

  const renderOpenDialogSwitch = (chatType) => {
    switch (chatType) {
      case '0':
        return openViewProfileDialog;
      case '1':
        return openTeamInfoDialog;
      case '2':
        return openGroupInfoDialog;
      case '3':
        return openDiscussInfoDialog;
      default:
        return openViewProfileDialog;
    }
  };

  const renderAvatarSwitch = (chatType) => {
    switch (chatType) {
      case '0':
        return getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.profilePic || "";
      case '1':
        return selectedChat?.chatDisplayPic;
      case '2':
        return selectedChat?.chatDisplayPic;
      case '3':
        return selectedChat?.chatDisplayPic;
      default:
        return openViewProfileDialog;
    }
  };

  return (
    <section
      className={`messagesHeader pointer-event d-flex justify-content-start 
            position-relative w-100 fw-bold bg-info bg-opacity-10 py-2`}
      onClick={hideEmojiPicker}
    >
      <CustomTooltip title="Go Back" placement="bottom-start" arrow>
        <IconButton
          onClick={closeChat}
          className={`d-flex d-md-none ms-3`}
          sx={{
            color: "#999999",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
        >
          <ArrowBack />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip
        title={renderInfoSwitch(chatType)}
        placement="bottom-start"
        arrow
      >
        <IconButton
          sx={{
            margin: "-8px",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
          className="pointer ms-0 ms-md-4"
          onClick={renderOpenDialogSwitch(chatType)}
        >
          <Avatar
            src={renderAvatarSwitch(chatType)}
            alt={"receiverAvatar"}
          />
        </IconButton>
      </CustomTooltip>

      <span className="ms-2 mt-1 fs-4 text-info" title={chatName}>
        {truncateString(chatName, 22, 17)}
      </span>

      <CustomTooltip title="Close Chat" placement="bottom-end" arrow>
        <IconButton
          onClick={closeChat}
          className="d-none d-md-flex"
          sx={{
            position: "absolute",
            right: 15,
            top: 8,
            color: "#999999",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
        >
          <Close />
        </IconButton>
      </CustomTooltip>
    </section>
  );
};

export default MsgsHeader;
