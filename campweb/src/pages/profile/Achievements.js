import {
  Tabs,
  Tab,
  Container,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  ListItemIcon,
  Badge,
  Chip, Avatar, ListItemSecondaryAction, LinearProgress, withStyles
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { TabContext, TabPanel } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import {useHistory, useParams} from "react-router";
import { ApiContext } from "../../api/ApiContext";
import {
  achievementPacks,
  achievementPacksNames,
  achievementInfo,
  achievements as achievementsList, karmaAchievements
} from "../../api/consts/Achievements";
import RAchievementsInfo from "../../api/requests/achievements/RAchievementsInfo";
import {theme, useLoggedIn} from "../../App";
import levels, {levelTranslateNames} from "../../api/consts/Levels";
import CampfireImage from "../../components/CampfireImage";
import RAchievementsPack from "../../api/requests/achievements/RAchievementsPack";

const ThickLinearProgress = withStyles(theme => ({
  root: {
    marginTop: 10,
    height: 20,
    borderRadius: 5
  }
}))(LinearProgress);

function Achievements(props) {
  const [tab, setTab] = useState("achievements");
  const apiClient = useContext(ApiContext);
  const [achievements, setAchievements] = useState(null);
  const [packCompleted, setPackCompleted] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [achievementsProgress, setAchievementsProgress] = useState({});
  const { accountId } = useParams();
  const history = useHistory();

  useLoggedIn(history, apiClient);

  useEffect(() => {
    async function loadAchievements() {
      const resp = await apiClient.makeRequest(
        new RAchievementsInfo(accountId)
      );
      resp.indexes = JSON.parse(resp.indexes);
      resp.lvls = JSON.parse(resp.lvls);

      let packCompleted = [];
      for (let pack in achievementPacks) {
        packCompleted[pack] = {total: achievementPacks[pack].length};
        for (let achiId of achievementPacks[pack]) {
          const achi = achievementsList[achiId];
          const lvl = resp.lvls[resp.indexes.indexOf(achi.index)] || 0;
          packCompleted[pack].lvl = (packCompleted[pack].lvl || 0) + achi.level * lvl;
          packCompleted[pack].amount = (packCompleted[pack].amount || 0)
            + Number(achi.maxLevel === lvl)
        }
      }

      setPackCompleted(packCompleted);
      setAchievements(resp);
    }
    loadAchievements();
  // eslint-disable-next-line
  }, []);
  useEffect(() => {
    async function reloadProgress() {
      for (let i in expanded) {
        if (! expanded[i]) continue;
        if (achievementsProgress[i]) continue;

        const packId = parseInt(i.replace("ACHI_PACK_", ""));
        const resp = await apiClient.makeRequest(
          new RAchievementsPack(accountId, packId)
        );
        resp.indexes = JSON.parse(resp.indexes);
        resp.progress = JSON.parse(resp.progress);
        const progress = [];
        for (let i in resp.indexes) {
          progress[resp.indexes[i]] = resp.progress[i];
        }
        setAchievementsProgress(prev => ({[i]: progress, ...prev}));
      }
    }
    reloadProgress();
  // eslint-disable-next-line
  }, [expanded]);

  return (
    <TabContext value={tab}>
      {achievements ? <Container maxWidth="sm">
        <Tabs
          value={tab} style={{marginTop: 10}}
          indicatorColor="primary" centered
          onChange={(ev, tab) => setTab(tab)}
        >
          <Tab value="achievements" label="Достижения" />
          <Tab value="privileges" label="Привилегии" />
        </Tabs>

        {/* Achievements */}
        <TabPanel style={{paddingLeft: 0, paddingRight: 0}} value="achievements">
          <Typography align="center" variant="h5">
            <strong>Уровень </strong>
            <span style={{color: theme.palette.success.main}}>
              {achievements.karmaForce / 100}
            </span>
          </Typography>
          <Typography align="center" variant="body1" color="textSecondary">
            Определяет размер вашей оценки публикациям и
            влияет на способности в приложении. Выполняйте
            достижения для увелечения уровня.
          </Typography>
          <List>
            {Object.keys(achievementPacks).map(key => (
              <React.Fragment key={key}>
                {/* Achievement pack expander */}
                <ListItem button onClick={() => setExpanded({...expanded, [key]: !expanded[key]})}>
                  <ListItemIcon>{expanded[key] ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                  <ListItemText primary={achievementPacksNames[key]} />
                  <ListItemSecondaryAction>
                    <Typography variant="body2" color="textSecondary">
                      {packCompleted[key].amount}/{packCompleted[key].total}
                      &nbsp;({packCompleted[key].lvl / 100})
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={expanded[key]}>
                  {/* Achievements */}
                  <List>{achievementPacks[key].map(ach => {
                    const achInfo = achievementsList[ach];

                    let progress = (achievementsProgress[key] || {})[achInfo.index] || 0;
                    let maxProgress = achInfo.targets[0];
                    for (let i in achInfo.targets) {
                      maxProgress = achInfo.targets[i];
                      if (achInfo.targets[i] > progress) {
                        break;
                      }
                    }
                    progress = Math.min(progress, maxProgress);

                    if (karmaAchievements.includes(ach)) {
                      progress = Math.floor(progress / 100);
                      maxProgress = Math.floor(maxProgress / 100);
                    }

                    return <ListItem button key={ach}>
                      <ListItemAvatar style={{paddingRight: 24}}>
                        <Badge
                          badgeContent={achInfo.level / 100}
                          color="primary"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        ><Avatar>
                          <CampfireImage
                            style={{width: "100%"}}
                            id={achievementInfo[ach][1]}
                          />
                        </Avatar></Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={apiClient.translate(achievementInfo[ach][0])}
                        secondaryTypographyProps={{component: "div"}}
                        secondary={
                          <Box position="relative">
                            <ThickLinearProgress
                              variant="determinate"
                              value={(progress || 0) / maxProgress * 100}
                            />
                            <Box
                              position="absolute"
                              top={0} left={0}
                              color={
                                !progress ?
                                theme.palette.text.primary :
                                theme.palette.primary.contrastText
                              }
                              width="100%" height="100%"
                              paddingLeft="10px"
                            >{progress || 0}/{maxProgress}</Box>
                          </Box>
                        }
                      />
                    </ListItem>;
                  })}</List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
        {/* Privileges */}
        <TabPanel style={{paddingLeft: 0, paddingRight: 0}} value="privileges">
          <Typography align="center" variant="h5">
            <strong>Карма за 30 дней </strong>
            <span style={{color: theme.palette.success.main}}>
              {achievements.karma30 / 100}
            </span>
          </Typography>
          <Typography align="center" variant="body1" color="textSecondary">
            Для использования модераторских способностей,
            необходимо иметь карму за 30 дней в фэндоме.
            А для админских функций, нужна карма за 30
            дней во всём приложении. Карма за использование
            способностей не отнимается.
          </Typography>

          <List>
            {Object.keys(levels).map(levelKey => {
              const levelPassed =
                achievements.karmaForce >= levels[levelKey].lvl &&
                achievements.karma30 >= levels[levelKey].karma;

              return <ListItem key={levelKey}>
                <ListItemIcon style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingRight: 15
                }}>
                  <Chip label={levels[levelKey].lvl / 100} style={{
                    background: levelPassed ? undefined :
                      levels[levelKey].isUser() ? theme.palette.success.main :
                      levels[levelKey].isModeration() ? theme.palette.info.main :
                      levels[levelKey].isAdmin() ? theme.palette.error.main :
                      theme.palette.success.main,
                    width: 60,
                    fontWeight: "bold"
                  }} variant={levelPassed ? "outlined" : "default"} />
                  {!!levels[levelKey].karma && <Typography variant="caption">
                    {levels[levelKey].karma / 100}
                  </Typography>}
                </ListItemIcon>
                <ListItemText>
                  {apiClient.translate(levelTranslateNames[levelKey])}
                </ListItemText>
              </ListItem>;
            })}
          </List>
        </TabPanel>
      </Container> : <Box width="100%" padding="20px" textAlign="center">
        <CircularProgress />
      </Box>}
    </TabContext>
  );
}

export default Achievements;
