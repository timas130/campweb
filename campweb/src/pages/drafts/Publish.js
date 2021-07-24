import {useContext, useEffect, useState} from "react";
import {ApiContext} from "../../api/ApiContext";
import {useParams} from "react-router";
import {Checkbox, CircularProgress, Container, Fab, FormControlLabel, List, ListItem, ListItemText, Dialog, Toolbar, Typography, IconButton, ListItemSecondaryAction} from "@material-ui/core";
import RTagsGetAll from "../../api/requests/tags/RTagsGetAll";
import RPostGetDraft from "../../api/requests/post/RPostGetDraft";
import {Tag} from "../../components/Tags";
import React from "react";
import {theme} from "../../App";
import {Done, Close, Delete} from "@material-ui/icons";
import RPostPublication from "../../api/requests/post/RPostPublication";
import {useHistory} from "react-router-dom";
import RActivitiesGetAllForAccount from "../../api/requests/activities/RActivitiesGetAllForAccount";
import InView from "react-intersection-observer";
import RRubricsGetAll, {count} from "../../api/requests/rubrics/RRubricsGetAll";
import Karma from "../../components/Karma";

function SelectActivityDialog(props) {
  const apiClient = useContext(ApiContext);
  const [activities, setActivities] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  async function loadActivities() {
    const resp = JSON.parse((await apiClient.makeRequest(
      new RActivitiesGetAllForAccount(
        apiClient.loginInfo.account["J_ID"],
        props.draft.fandom.id, props.draft.languageId,
        activities.length
      )
    )).userActivities);
    setActivities([...activities, ...resp]);
    if (resp.length === 0) setCanLoadMore(false);
  }

  return (
    <Dialog fullScreen open={props.open}>
      <Toolbar>
        <Typography variant="h6">Выберите фэндом</Typography>
        <IconButton onClick={() => props.onSelect(null)} style={{marginLeft: "auto"}}>
          <Close />
        </IconButton>
      </Toolbar>
      <Container maxWidth="sm">
        <List>
          {activities.map(activity => (
            <ListItem button key={activity.id} onClick={() => props.onSelect(activity)}>
              <ListItemText primary={activity.name} secondary={activity.description} />
            </ListItem>
          ))}
        </List>
        {canLoadMore && <InView as="div" onChange={inView => inView && loadActivities()}
                                style={{textAlign: "center", padding: 10}}>
          <CircularProgress />
        </InView>}
      </Container>
    </Dialog>
  );
}

function SelectRubricDialog(props) {
  const apiClient = useContext(ApiContext);
  const [rubrics, setRubrics] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  async function loadRubrics() {
    const resp = JSON.parse((await apiClient.makeRequest(
      new RRubricsGetAll(
        props.draft.fandom.id, props.draft.languageId,
        apiClient.loginInfo.account["J_ID"], rubrics.length
      )
    )).rubrics);
    setRubrics([...rubrics, ...resp]);
    console.log(resp);
    if (resp.length < count) setCanLoadMore(false);
  }

  return (
    <Dialog fullScreen open={props.open}>
      <Toolbar>
        <Typography variant="h6">Выберите рубрику</Typography>
        <IconButton onClick={() => props.onSelect(null)} style={{marginLeft: "auto"}}>
          <Close />
        </IconButton>
      </Toolbar>
      <Container maxWidth="sm">
        <List>
          {rubrics.map(rubric => (
            <ListItem button key={rubric.id} onClick={() => props.onSelect(rubric)}>
              <ListItemText primary={rubric.name} />
              <ListItemSecondaryAction>
                <Karma amount={rubric.karmaCof} cof />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {canLoadMore && <InView as="div" onChange={inView => inView && loadRubrics()}
                                         style={{textAlign: "center", padding: 10}}>
          <CircularProgress />
        </InView>}
      </Container>
    </Dialog>
  );
}

export default function Publish() {
  const apiClient = useContext(ApiContext);
  const history = useHistory();
  const draftId = parseInt(useParams().draftId);

  const [draft, setDraft] = useState(null);
  const [tags, setTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [activitySelectorOpen, setActivitySelectorOpen] = useState(false);
  const [rubricSelectorOpen, setRubricSelectorOpen] = useState(false);

  const [notifyFollowers, setNotifyFollowers] = useState(false);
  const [closedPost, setClosedPost] = useState(false);
  const [multilingual, setMultilingual] = useState(false);
  const [activity, setActivity] = useState(null);
  const [rubric, setRubric] = useState(null);

  useEffect(() => {
    async function load() {
      const draftLoaded = (await apiClient.makeRequest(
        new RPostGetDraft(draftId)
      )).unit;
      setDraft(draftLoaded);
      const tagsLoaded = JSON.parse((await apiClient.makeRequest(
        new RTagsGetAll(draftLoaded.fandom.id, draftLoaded.languageId)
      )).tags);
      setTags(tagsLoaded);
      setTagsLoading(false);
    }
    load();
  // eslint-disable-next-line
  }, []);

  const onPublish = async () => {
    const req = new RPostPublication(
      draftId, activeTags, "", notifyFollowers, 0,
      closedPost, multilingual, rubric ? rubric.id : 0,
      activity ? activity.id : 0, 0
    );
    await apiClient.makeRequest(req);

    history.push(`/post/${draftId}`);
  };

  return (
    <Container maxWidth="sm" style={{paddingBottom: 80}}>
      {
        draft &&
        <SelectActivityDialog
          open={activitySelectorOpen} draft={draft}
          onSelect={activity => {
            if (activity) setActivity(activity);
            setActivitySelectorOpen(false);
          }}
        />
      }
      {
        draft &&
        <SelectRubricDialog
          open={rubricSelectorOpen} draft={draft}
          onSelect={rubric => {
            if (rubric) setRubric(rubric);
            setRubricSelectorOpen(false);
          }}
        />
      }

      {
        tagsLoading ?
        <div style={{width: "100%", padding: 20, textAlign: "center"}}>
          <CircularProgress />
        </div> :
        tags
          .filter(tag => tag.parentUnitId === 0)
          .map(tag => <React.Fragment key={tag.id}>
            <h3>{JSON.parse(tag.jsonDB)["J_NAME"]}</h3>
            {tags
              .filter(childTag => childTag.parentUnitId === tag.id)
              .map(childTag => (
                <Tag
                  key={childTag.id}
                  main={activeTags.includes(childTag.id)}
                  style={{margin: "2px 0 2px 2px"}}
                  jsonDB={JSON.parse(childTag.jsonDB)}
                  onClick={() => {
                    let newTags = [...activeTags];
                    if (newTags.includes(childTag.id))
                      delete newTags[newTags.indexOf(childTag.id)];
                    else
                      newTags.push(childTag.id);
                    setActiveTags(newTags);
                  }}
                />
              ))}
          </React.Fragment>)
      }
      {!tagsLoading && tags.length === 0 && "Тегов в этом фэндоме пока нет"}

      <br />
      <FormControlLabel
        control={<Checkbox
          checked={notifyFollowers} color="primary"
          onChange={ev => setNotifyFollowers(ev.target.checked)}
        />}
        label="Уведомить своих подписчиков"
      /><br />
      <FormControlLabel
        control={<Checkbox
          checked={closedPost} color="primary"
          onChange={ev => setClosedPost(ev.target.checked)}
        />}
        label="Закрытая публикация"
      /><br />
      <FormControlLabel
        control={<Checkbox
          checked={multilingual} color="primary"
          onChange={ev => setMultilingual(ev.target.checked)}
        />}
        label="Мультиязычный"
      /><br />

      <List>
        <ListItem button onClick={() => setRubricSelectorOpen(true)}>
          <ListItemText primary={
            rubric ? "Рубрика: " + rubric.name : "Добавить рубрику"
          } />
          {rubric && <ListItemSecondaryAction>
            <IconButton onClick={() => setRubric(null)}><Delete /></IconButton>
          </ListItemSecondaryAction>}
        </ListItem>
        <ListItem button onClick={() => setActivitySelectorOpen(true)}>
          <ListItemText primary={
            activity ? "Эстафета: " + activity.name : "Добавить эстафету"
          } />
          {activity && <ListItemSecondaryAction>
            <IconButton onClick={() => setActivity(null)}><Delete /></IconButton>
          </ListItemSecondaryAction>}
        </ListItem>
      </List>

      <Fab
        style={{
          position: "fixed",
          bottom: 16, right: 16,
          background: theme.palette.success.main
        }}
        onClick={onPublish}
      ><Done /></Fab>
    </Container>
  );
}
