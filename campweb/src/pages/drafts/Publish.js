import {useContext, useEffect, useState} from "react";
import {ApiContext} from "../../api/ApiContext";
import {useParams} from "react-router";
import {Checkbox, CircularProgress, Container, Fab, FormControlLabel} from "@material-ui/core";
import RTagsGetAll from "../../api/requests/tags/RTagsGetAll";
import RPostGetDraft from "../../api/requests/post/RPostGetDraft";
import {Tag} from "../../components/Tags";
import React from "react";
import {theme} from "../../App";
import {Done} from "@material-ui/icons";
import RPostPublication from "../../api/requests/post/RPostPublication";
import {useHistory} from "react-router-dom";

export default function Publish() {
  const apiClient = useContext(ApiContext);
  const history = useHistory();
  const draftId = parseInt(useParams().draftId);

  // const [draft, setDraft] = useState(null);
  const [tags, setTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  const [notifyFollowers, setNotifyFollowers] = useState(false);
  const [closedPost, setClosedPost] = useState(false);
  const [multilingual, setMultilingual] = useState(false);

  useEffect(() => {
    async function load() {
      const draftLoaded = (await apiClient.makeRequest(
        new RPostGetDraft(draftId)
      )).unit;
      // setDraft(draftLoaded);
      const tagsLoaded = JSON.parse((await apiClient.makeRequest(
        new RTagsGetAll(draftLoaded.fandom.id, draftLoaded.languageId)
      )).tags);
      console.log(tagsLoaded);
      setTags(tagsLoaded);
      setTagsLoading(false);
    }
    load();
  // eslint-disable-next-line
  }, []);

  const onPublish = async () => {
    const req = new RPostPublication(
      draftId, tags, "", notifyFollowers, 0,
      closedPost, multilingual, 0, 0, 0
    );
    await apiClient.makeRequest(req);

    history.push(`/post/${draftId}`);
  };

  return (
    <Container maxWidth="sm">
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
                  main={activeTags[childTag.id]}
                  style={{margin: "2px 0 2px 2px"}}
                  jsonDB={JSON.parse(childTag.jsonDB)}
                  onClick={() => {
                    const newTags = [...activeTags];
                    if (newTags[childTag.id]) {
                      delete newTags[childTag.id];
                    } else {
                      newTags[childTag.id] = true;
                    }
                    setActiveTags(newTags);
                  }}
                />
              ))}
          </React.Fragment>)
      }
      {!tagsLoading && tags.length === 0 && "Тегов в этом фэндоме пока нет"}

      <FormControlLabel
        control={<Checkbox
          checked={notifyFollowers} color="primary"
          onChange={ev => setNotifyFollowers(ev.target.checked)}
        />}
        label="Уведомить своих подписчиков"
      />
      <FormControlLabel
        control={<Checkbox
          checked={closedPost} color="primary"
          onChange={ev => setClosedPost(ev.target.checked)}
        />}
        label="Закрытая публикация"
      />
      <FormControlLabel
        control={<Checkbox
          checked={multilingual} color="primary"
          onChange={ev => setMultilingual(ev.target.checked)}
        />}
        label="Мультиязычный"
      />

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
