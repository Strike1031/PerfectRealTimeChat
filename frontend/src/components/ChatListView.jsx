import { GroupAdd } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import * as React from 'react';
import {
  debounce,
  getAxiosConfig,
  getOneToOneChatReceiver,
  truncateString,
} from "../utils/appUtils";
import axios from "../utils/axios";
import AddMembersToGroup from "./dialogs/AddMembersToGroup";
import ChatListItem from "./utils/ChatListItem";
import getCustomTooltip from "./utils/CustomTooltip";
import FullSizeImage from "./utils/FullSizeImage";
import LoadingList from "./utils/LoadingList";
import SearchInput from "./utils/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAppState,
  setDeleteNotifsOfChat,
  setFetchMsgs,
  setGroupInfo,
  setSelectedChat,
} from "../store/slices/AppSlice";
import {
  displayDialog,
  setShowDialogActions,
} from "../store/slices/CustomDialogSlice";
import { displayToast } from "../store/slices/ToastSlice";
import GettingStarted from "./GettingStarted";

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddMembersToTeam from "./dialogs/AddMembersToTeam";
import AddMembersToDiscuss from "./dialogs/AddMembersToDiscuss";

const DEFAULT_GROUP_DP = process.env.REACT_APP_DEFAULT_GROUP_DP;

const arrowStyles = { color: "#666" };
const tooltipStyles = {
  maxWidth: 250,
  color: "#eee",
  fontFamily: "Trebuchet MS",
  fontSize: 16,
  padding: "5px 12px",
  backgroundColor: "#666",
};
const CustomTooltip = getCustomTooltip(arrowStyles, tooltipStyles);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const ChatListView = ({
  chats,
  setChats,
  loadingMsgs,
  setDialogBody,
  typingChatUsers,
}) => {

  const theme = useTheme();
  const [valueTab, setValueTab] = useState(0);

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setValueTab(index);
  };

  const { loggedInUser, selectedChat, refresh } = useSelector(selectAppState);
  const notifs = [...loggedInUser?.notifications];
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [filteredChats, setFilteredChats] = useState(chats);
  const [filteredTeamChats, setFilteredTeamChats] = useState(chats);
  const [filteredGroupChats, setFilteredGroupChats] = useState(chats);
  const [filteredDiscussChats, setFilteredDiscussChats] = useState(chats);
  const searchChatInput = useRef();

  const openCreateGroupChatDialog = () => {
    dispatch(
      setGroupInfo({
        chatDisplayPic: null,
        chatDisplayPicUrl: DEFAULT_GROUP_DP,
        chatName: "",
        users: [],
      })
    );
    dispatch(setShowDialogActions(true));
    setDialogBody(<AddMembersToGroup forCreateGroup={true} />);
    dispatch(
      displayDialog({
        title: "Add Group Members",
        nolabel: "Cancel",
        yeslabel: "Next",
        action: null,
      })
    );
  };

  const openCreateTeamChatDialog = () => {
    dispatch(
      setGroupInfo({
        chatDisplayPic: null,
        chatDisplayPicUrl: DEFAULT_GROUP_DP,
        chatName: "",
        users: [],
      })
    );
    dispatch(setShowDialogActions(true));
    setDialogBody(<AddMembersToTeam forCreateGroup={true} />);
    dispatch(
      displayDialog({
        title: "Add Team Members",
        nolabel: "Cancel",
        yeslabel: "Next",
        action: null,
      })
    );
  };

  const openCreateDiscussChatDialog = () => {
    dispatch(
      setGroupInfo({
        chatDisplayPic: null,
        chatDisplayPicUrl: DEFAULT_GROUP_DP,
        chatName: "",
        users: [],
      })
    );
    dispatch(setShowDialogActions(true));
    setDialogBody(<AddMembersToDiscuss forCreateGroup={true} />);
    dispatch(
      displayDialog({
        title: "Add Discuss Members",
        nolabel: "Cancel",
        yeslabel: "Next",
        action: null,
      })
    );
  };

  const displayFullSizeImage = (e) => {
    dispatch(setShowDialogActions(false));
    setDialogBody(<FullSizeImage event={e} />);
    dispatch(
      displayDialog({
        isFullScreen: true,
        title: e.target?.alt || "Display Pic",
      })
    );
  };

  const fetchChats = async () => {
    const config = getAxiosConfig({ loggedInUser });
    try {
      const { data } = await axios.get(`/api/chat/members`, config);

      const mappedChats = data
        .map((chat) => {
          const { isGroupChat, users } = chat;

          if (isGroupChat === '0') {
            const receiver = getOneToOneChatReceiver(loggedInUser, users);
            chat["chatName"] = receiver?.name;
            chat["receiverEmail"] = receiver?.email;
            chat["chatDisplayPic"] = receiver?.profilePic;
          }
          return chat;
        })
        .filter((chat) => chat.lastMessage !== undefined || chat.isGroupChat);

      setChats(mappedChats);
      setFilteredChats(mappedChats);
      if (loading) setLoading(false);
    } catch (error) {
      dispatch(
        displayToast({
          title: "Couldn't Fetch Members",
          message: error.response?.data?.message || error.message,
          type: "error",
          duration: 5000,
          position: "bottom-center",
        })
      );
      if (loading) setLoading(false);
    }
  };

  const fetchTeamChats = async () => {
    const config = getAxiosConfig({ loggedInUser });
    try {
      const { data } = await axios.get(`/api/chat/teams`, config);
      console.log(data);
      const mappedChats = data
        .map((chat) => {
          const { isGroupChat, users } = chat;

          if (isGroupChat === 0) {
            const receiver = getOneToOneChatReceiver(loggedInUser, users);
            chat["chatName"] = receiver?.name;
            chat["receiverEmail"] = receiver?.email;
            chat["chatDisplayPic"] = receiver?.profilePic;
          }
          return chat;
        })
        .filter((chat) => chat.lastMessage !== undefined || chat.isGroupChat);

      setChats(mappedChats);
      setFilteredTeamChats(mappedChats);
      if (loading) setLoading(false);
    } catch (error) {
      dispatch(
        displayToast({
          title: "Couldn't Fetch Team",
          message: error.response?.data?.message || error.message,
          type: "error",
          duration: 5000,
          position: "bottom-center",
        })
      );
      if (loading) setLoading(false);
    }
  };

  const fetchGroupChats = async () => {
    const config = getAxiosConfig({ loggedInUser });
    try {
      const { data } = await axios.get(`/api/chat/groups`, config);
      console.log(data);
      const mappedChats = data
        .map((chat) => {
          const { isGroupChat, users } = chat;

          if (isGroupChat === 0) {
            const receiver = getOneToOneChatReceiver(loggedInUser, users);
            chat["chatName"] = receiver?.name;
            chat["receiverEmail"] = receiver?.email;
            chat["chatDisplayPic"] = receiver?.profilePic;
          }
          return chat;
        })
        .filter((chat) => chat.lastMessage !== undefined || chat.isGroupChat);

      setChats(mappedChats);
      setFilteredGroupChats(mappedChats);
      if (loading) setLoading(false);
    } catch (error) {
      dispatch(
        displayToast({
          title: "Couldn't Fetch Group",
          message: error.response?.data?.message || error.message,
          type: "error",
          duration: 5000,
          position: "bottom-center",
        })
      );
      if (loading) setLoading(false);
    }
  };

  const fetchDiscussChats = async () => {
    const config = getAxiosConfig({ loggedInUser });
    try {
      const { data } = await axios.get(`/api/chat/discuss`, config);
      console.log(data);
      const mappedChats = data
        .map((chat) => {
          const { isGroupChat, users } = chat;

          if (isGroupChat === 0) {
            const receiver = getOneToOneChatReceiver(loggedInUser, users);
            chat["chatName"] = receiver?.name;
            chat["receiverEmail"] = receiver?.email;
            chat["chatDisplayPic"] = receiver?.profilePic;
          }
          return chat;
        })
        .filter((chat) => chat.lastMessage !== undefined || chat.isGroupChat);

      setChats(mappedChats);
      setFilteredDiscussChats(mappedChats);
      if (loading) setLoading(false);
    } catch (error) {
      dispatch(
        displayToast({
          title: "Couldn't Fetch Discussion",
          message: error.response?.data?.message || error.message,
          type: "error",
          duration: 5000,
          position: "bottom-center",
        })
      );
      if (loading) setLoading(false);
    }
  };

  // Debouncing filterChats method to limit the no. of fn calls
  const searchChats = debounce((e) => {
    const chatNameInput = e.target.value?.toLowerCase().trim();
    if (!chatNameInput) return setFilteredChats(chats);
    setFilteredChats(
      chats.filter((chat) =>
        chat?.chatName?.toLowerCase().includes(chatNameInput)
      )
    );
  }, 600);

  useEffect(() => {
    fetchChats();
    fetchTeamChats();
    fetchGroupChats();
    fetchDiscussChats();
  }, [refresh]);


  return (
    <div
      className={`chatpageDiv chatpageView chatListView text-light ${selectedChat ? "d-none d-md-flex" : "d-flex"
        } flex-column user-select-none mx-1 p-2 ${loadingMsgs ? "pe-none" : "pe-auto"
        }`}
    >
      <AppBar position="static" sx="background: none">
        <Tabs
          value={valueTab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="full width tabs example"
        >
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Teams" {...a11yProps(1)} />
          <Tab label="Groups" {...a11yProps(2)} />
          <Tab label="Discussions" {...a11yProps(3)} />
        </Tabs>
      </AppBar >
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={valueTab}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={valueTab} index={0} dir={theme.direction}>
          <section className="position-relative">
            <p className="chatListHeader fw-bold fs-4 rounded-pill bg-info bg-opacity-10 py-2">
              MEMBERS
            </p>
          </section>
          {/* Search Bar */}
          {chats?.length > 0 && (
            <section className="searchChat">
              <SearchInput
                ref={searchChatInput}
                searchHandler={searchChats}
                autoFocus={false}
                placeholder="Search Members"
                clearInput={() => setFilteredChats(chats)}
              />
            </section>
          )}
          {/* Chat list */}
          <section className="chatList m-1 p-1 overflow-auto position-relative">
            {loading ? (
              <LoadingList listOf="Chat" dpRadius={"49px"} count={8} />
            ) : filteredChats?.length > 0 ? (
              <div
                // 'Event delegation' (add only one event listener for
                // parent element instead of adding for each child element)
                onClick={(e) => {
                  const { dataset } = e.target;
                  const parentDataset = e.target.parentNode.dataset;
                  const clickedChatId = dataset.chat || parentDataset.chat;
                  const hasNotifs = dataset.hasNotifs || parentDataset.hasNotifs;
                  if (!clickedChatId) return;

                  if (e.target.className?.toString().includes("MuiAvatar-img")) {
                    return displayFullSizeImage(e);
                  }
                  const clickedChat = filteredChats.find(
                    (chat) => chat._id === clickedChatId
                  );
                  if (clickedChat._id === selectedChat?._id) return;
                  dispatch(setSelectedChat(clickedChat));
                  dispatch(setFetchMsgs(true)); // To fetch selected chat msgs
                  if (clickedChat?.isGroupChat) dispatch(setGroupInfo(clickedChat));

                  // Delete notifications if notif badge is present
                  if (hasNotifs) dispatch(setDeleteNotifsOfChat(clickedChatId));
                }}
              >
                {filteredChats.map((chat) => {
                  let chatNotifCount = 0;
                  notifs?.forEach((notif) => {
                    if (notif.chat._id === chat._id) ++chatNotifCount;
                  });
                  return (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      chatNotifCount={chatNotifCount || ""}
                      typingChatUser={typingChatUsers?.find(
                        (u) => u?.toString()?.split("---")[0] === chat._id
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <span className="d-inline-block w-100 text-light fs-3 mt-4 mx-auto">
                  {chats?.length === 0
                    ? `Hi ${truncateString(loggedInUser?.name?.split(" ")[0], 12, 9) ||
                    "There"
                    } 😎`
                    : "No Members Found"}
                </span>
                {chats?.length === 0 && <GettingStarted />}
              </>
            )}
          </section>
        </TabPanel>
        <TabPanel value={valueTab} index={1} dir={theme.direction}>
          <section className="position-relative">
            <p className="chatListHeader fw-bold fs-4 rounded-pill bg-info bg-opacity-10 py-2">
              TEAMS
              {/* Create Group Chat */}
              {loggedInUser.email === 'strike10310522@gmail.com' ?

                <CustomTooltip
                  title="Create New Team"
                  placement="bottom-end"
                  arrow
                >
                  <button
                    className={`btnCreateGroup pointer btn btn-outline-secondary text-light px-3`}
                    onClick={openCreateTeamChatDialog}
                  >
                    <GroupAdd />
                  </button>
                </CustomTooltip>
                :
                <p></p>
              }
            </p>
          </section>
          {/* Search Bar */}
          {chats?.length > 0 && (
            <section className="searchChat">
              <SearchInput
                ref={searchChatInput}
                searchHandler={searchChats}
                autoFocus={false}
                placeholder="Search Teams"
                clearInput={() => setFilteredTeamChats(chats)}
              />
            </section>
          )}
          {/* Chat list */}
          <section className="chatList m-1 p-1 overflow-auto position-relative">
            {loading ? (
              <LoadingList listOf="Chat" dpRadius={"49px"} count={8} />
            ) : filteredTeamChats?.length > 0 ? (
              <div
                // 'Event delegation' (add only one event listener for
                // parent element instead of adding for each child element)
                onClick={(e) => {
                  const { dataset } = e.target;
                  const parentDataset = e.target.parentNode.dataset;
                  const clickedChatId = dataset.chat || parentDataset.chat;
                  const hasNotifs = dataset.hasNotifs || parentDataset.hasNotifs;
                  if (!clickedChatId) return;

                  if (e.target.className?.toString().includes("MuiAvatar-img")) {
                    return displayFullSizeImage(e);
                  }
                  const clickedChat = filteredTeamChats.find(
                    (chat) => chat._id === clickedChatId
                  );
                  if (clickedChat._id === selectedChat?._id) return;
                  dispatch(setSelectedChat(clickedChat));
                  dispatch(setFetchMsgs(true)); // To fetch selected chat msgs
                  if (clickedChat?.isGroupChat) dispatch(setGroupInfo(clickedChat));

                  // Delete notifications if notif badge is present
                  if (hasNotifs) dispatch(setDeleteNotifsOfChat(clickedChatId));
                }}
              >
                {filteredTeamChats.map((chat) => {
                  let chatNotifCount = 0;
                  notifs?.forEach((notif) => {
                    if (notif.chat._id === chat._id) ++chatNotifCount;
                  });
                  return (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      chatNotifCount={chatNotifCount || ""}
                      typingChatUser={typingChatUsers?.find(
                        (u) => u?.toString()?.split("---")[0] === chat._id
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <span className="d-inline-block w-100 text-light fs-3 mt-4 mx-auto">
                  {chats?.length === 0
                    ? `Hi ${truncateString(loggedInUser?.name?.split(" ")[0], 12, 9) ||
                    "There"
                    } 😎`
                    : "No Team Found"}
                </span>
                {chats?.length === 0 && <GettingStarted />}
              </>
            )}
          </section>
        </TabPanel>
        <TabPanel value={valueTab} index={2} dir={theme.direction}>
          <section className="position-relative">
            <p className="chatListHeader fw-bold fs-4 rounded-pill bg-info bg-opacity-10 py-2">
              GROUPS
              {/* Create Group Chat */}
              {loggedInUser.email === 'strike10310522@gmail.com' ?

                <CustomTooltip
                  title="Create New Group"
                  placement="bottom-end"
                  arrow
                >
                  <button
                    className={`btnCreateGroup pointer btn btn-outline-secondary text-light px-3`}
                    onClick={openCreateGroupChatDialog}
                  >
                    <GroupAdd />
                  </button>
                </CustomTooltip>
                :
                <p></p>
              }
            </p>
          </section>
          {/* Search Bar */}
          {chats?.length > 0 && (
            <section className="searchChat">
              <SearchInput
                ref={searchChatInput}
                searchHandler={searchChats}
                autoFocus={false}
                placeholder="Search Groups"
                clearInput={() => setFilteredGroupChats(chats)}
              />
            </section>
          )}
          {/* Chat list */}
          <section className="chatList m-1 p-1 overflow-auto position-relative">
            {loading ? (
              <LoadingList listOf="Chat" dpRadius={"49px"} count={8} />
            ) : filteredGroupChats?.length > 0 ? (
              <div
                // 'Event delegation' (add only one event listener for
                // parent element instead of adding for each child element)
                onClick={(e) => {
                  const { dataset } = e.target;
                  const parentDataset = e.target.parentNode.dataset;
                  const clickedChatId = dataset.chat || parentDataset.chat;
                  const hasNotifs = dataset.hasNotifs || parentDataset.hasNotifs;
                  if (!clickedChatId) return;

                  if (e.target.className?.toString().includes("MuiAvatar-img")) {
                    return displayFullSizeImage(e);
                  }
                  const clickedChat = filteredGroupChats.find(
                    (chat) => chat._id === clickedChatId
                  );
                  if (clickedChat._id === selectedChat?._id) return;
                  dispatch(setSelectedChat(clickedChat));
                  dispatch(setFetchMsgs(true)); // To fetch selected chat msgs
                  if (clickedChat?.isGroupChat) dispatch(setGroupInfo(clickedChat));

                  // Delete notifications if notif badge is present
                  if (hasNotifs) dispatch(setDeleteNotifsOfChat(clickedChatId));
                }}
              >
                {filteredGroupChats.map((chat) => {
                  let chatNotifCount = 0;
                  notifs?.forEach((notif) => {
                    if (notif.chat._id === chat._id) ++chatNotifCount;
                  });
                  return (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      chatNotifCount={chatNotifCount || ""}
                      typingChatUser={typingChatUsers?.find(
                        (u) => u?.toString()?.split("---")[0] === chat._id
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <span className="d-inline-block w-100 text-light fs-3 mt-4 mx-auto">
                  {chats?.length === 0
                    ? `Hi ${truncateString(loggedInUser?.name?.split(" ")[0], 12, 9) ||
                    "There"
                    } 😎`
                    : "No Group Found"}
                </span>
                {chats?.length === 0 && <GettingStarted />}
              </>
            )}
          </section>
        </TabPanel>
        <TabPanel value={valueTab} index={3} dir={theme.direction}>
          <section className="position-relative">
            <p className="chatListHeader fw-bold fs-4 rounded-pill bg-info bg-opacity-10 py-2">
              DISCUSSIONS
              {/* Create Group Chat */}
              {loggedInUser.email === 'strike10310522@gmail.com' ?

                <CustomTooltip
                  title="Create New Discussion"
                  placement="bottom-end"
                  arrow
                >
                  <button
                    className={`btnCreateGroup pointer btn btn-outline-secondary text-light px-3`}
                    onClick={openCreateDiscussChatDialog}
                  >
                    <GroupAdd />
                  </button>
                </CustomTooltip>
                :
                <p></p>
              }
            </p>
          </section>
          {/* Search Bar */}
          {chats?.length > 0 && (
            <section className="searchChat">
              <SearchInput
                ref={searchChatInput}
                searchHandler={searchChats}
                autoFocus={false}
                placeholder="Search Discussion"
                clearInput={() => setFilteredDiscussChats(chats)}
              />
            </section>
          )}
          {/* Chat list */}
          <section className="chatList m-1 p-1 overflow-auto position-relative">
            {loading ? (
              <LoadingList listOf="Chat" dpRadius={"49px"} count={8} />
            ) : filteredDiscussChats?.length > 0 ? (
              <div
                // 'Event delegation' (add only one event listener for
                // parent element instead of adding for each child element)
                onClick={(e) => {
                  const { dataset } = e.target;
                  const parentDataset = e.target.parentNode.dataset;
                  const clickedChatId = dataset.chat || parentDataset.chat;
                  const hasNotifs = dataset.hasNotifs || parentDataset.hasNotifs;
                  if (!clickedChatId) return;

                  if (e.target.className?.toString().includes("MuiAvatar-img")) {
                    return displayFullSizeImage(e);
                  }
                  const clickedChat = filteredDiscussChats.find(
                    (chat) => chat._id === clickedChatId
                  );
                  if (clickedChat._id === selectedChat?._id) return;
                  dispatch(setSelectedChat(clickedChat));
                  dispatch(setFetchMsgs(true)); // To fetch selected chat msgs
                  if (clickedChat?.isGroupChat) dispatch(setGroupInfo(clickedChat));

                  // Delete notifications if notif badge is present
                  if (hasNotifs) dispatch(setDeleteNotifsOfChat(clickedChatId));
                }}
              >
                {filteredDiscussChats.map((chat) => {
                  let chatNotifCount = 0;
                  notifs?.forEach((notif) => {
                    if (notif.chat._id === chat._id) ++chatNotifCount;
                  });
                  return (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      chatNotifCount={chatNotifCount || ""}
                      typingChatUser={typingChatUsers?.find(
                        (u) => u?.toString()?.split("---")[0] === chat._id
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <span className="d-inline-block w-100 text-light fs-3 mt-4 mx-auto">
                  {chats?.length === 0
                    ? `Hi ${truncateString(loggedInUser?.name?.split(" ")[0], 12, 9) ||
                    "There"
                    } 😎`
                    : "No Discussions Found"}
                </span>
                {chats?.length === 0 && <GettingStarted />}
              </>
            )}
          </section>
        </TabPanel>
      </SwipeableViews>

    </div>
  );
};

export default ChatListView;
