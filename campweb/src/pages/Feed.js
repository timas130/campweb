import { CircularProgress, Container, Tabs, Tab } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../api/ApiContext";
import PostCard from "../components/PostCard";
import RPostFeedGetAll from "../api/requests/post/RPostFeedGetAll";
import InView from "react-intersection-observer";
import { Alert, AlertTitle } from "@material-ui/lab";
import RPostFeedGetAllSubscribe from "../api/requests/post/RPostFeedGetAllSubscribe";
import { useHistory } from "react-router";

async function loadMorePosts(apiClient, posts, setPosts, loading, setLoading, tab) {
  if (loading) return;
  setLoading(true);

  let response;
  console.log("[feed] loading more posts, tab", tab);
  if (tab === 0) {
    response = JSON.parse((await apiClient
      .makeRequest(new RPostFeedGetAllSubscribe(
        posts[posts.length - 1] ? posts[posts.length - 1].dateCreate : 0
      )))
      .units);
  } else {
    response = JSON.parse((await apiClient
      .makeRequest(new RPostFeedGetAll(
        posts[posts.length - 1] ? posts[posts.length - 1].dateCreate : 0,
        JSON.parse(apiClient.loginInfo.settings.feedLanguages),
        JSON.parse(apiClient.loginInfo.settings.feedCategories), false,
        {0: -1, 1: 0, 2: 2, 3: 1, 4: 0, 5: 0}[tab], 
        {0: false, 1: true, 2: true, 3: true, 4: true, 5: false}[tab], 
        {0: false, 1: true, 2: false, 3: false, 4: false, 5: true}[tab]
      )))
      .units);
  }
  setPosts([...posts, ...response]);
  console.log(response);
  setLoading(false);
}
function Feed() {
  const apiClient = useContext(ApiContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const history = useHistory()

  useEffect(() => {
    if (! apiClient.loginInfo) history.push("/login");
  });
  useEffect(() => {
    if (posts.length === 0)
      loadMorePosts(apiClient, posts, setPosts, loading, setLoading, tab);
  }, [apiClient, posts, loading, tab]);

  const onBottom = (inView) => {
    if (inView && !loading) {
      loadMorePosts(apiClient, posts, setPosts, loading, setLoading, tab);
    }
  };
  const onTabChange = (event, tab) => {
    setTab(tab);
    setPosts([]);
    loadMorePosts(apiClient, [], setPosts, loading, setLoading, tab);
  };

  return (
    <Container maxWidth="sm">
      <div style={{paddingTop: 10, paddingBottom: 10}}><Alert severity="error">
        <AlertTitle>Известные баги/что пока не работает:</AlertTitle>
        1. В свернутом виде посты могут быть больше, чем в развернётом<br />
        2. Иногда теряется сессия<br />
        3. Нельзя сделать ничего, есть только посты тут. Разве что можно ставить карму.<br />
      </Alert></div>
      <Tabs value={tab}
        onChange={onTabChange} variant="scrollable"
        textColor="primary" indicatorColor="primary"
      >
        <Tab label="Подписки" />
        <Tab label="Всё" />
        <Tab label="Лучшее" />
        <Tab label="Хорошее" />
        <Tab label="Бездна" />
        <Tab label="Всё + подписки" />
      </Tabs>
      {
        posts ?
        posts.map((post, idx) => <PostCard key={idx} post={post} />) :
        ""
      }
      <InView as="div" style={{textAlign: "center", padding: 10}} onChange={onBottom}>
        <CircularProgress />
      </InView>
    </Container>
  );
}

export default Feed;
