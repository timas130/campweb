import { Card, CardHeader, CardContent, Typography, withStyles, CardActions, Button } from "@material-ui/core";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../api/ApiContext";
import { theme } from "../../App";
import CampfireAvatar from "../CampfireAvatar";
import API from "../../api/api.json";
import RActivitiesRelayRaceMember from "../../api/requests/activities/RActivitiesRelayRaceMember";

const UserActivityNext = withStyles({
  root: {
    paddingTop: 0,
    display: "flex"
  }
})(CardContent);

function UserActivity(props) {
  // eslint-disable-next-line
  const [date, setDate] = useState(null);
  const [myMemberStatus, setMyMemberStatus] = useState(props.activity.myMemberStatus);
  const [currentAccount, setCurrentAccount] = useState(props.activity.currentAccount);

  const apiClient = useContext(ApiContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
      if (new Date().getTime() > (props.activity.tag_2 + API["ACTIVITIES_RELAY_RACE_TIME"]) * 1000) {
        setCurrentAccount(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const changeParticitationStatus = async () => {
    const resp = await apiClient.makeRequest(
      new RActivitiesRelayRaceMember(
        props.activity.id, ! myMemberStatus
      )
    );
    setMyMemberStatus(! myMemberStatus);
    if (resp.myIsCurrentMember) {
      setCurrentAccount(apiClient.loginInfo.account);
    }
  };

  return (
    <Card>
      <CardHeader title={props.activity.name}
        subheader={props.activity.description} />
      <UserActivityNext>
        {
          currentAccount ?
          <CampfireAvatar style={{marginRight: 10}} account={currentAccount} /> :
          ""
        }
        <div>
          <Typography variant="body1">
            {currentAccount ? currentAccount["J_NAME"] : "Нет пользователя"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Следующий
          </Typography>
        </div>
        {props.activity.tag_2 ? <div style={{marginLeft: "auto", textAlign: "right"}}>
          <Typography variant="body1">
            {moment(props.activity.tag_2 + API["ACTIVITIES_RELAY_RACE_TIME"]).locale("ru").fromNow(true)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Времени осталось
          </Typography>
        </div> : ""}
      </UserActivityNext>
      <CardActions style={{paddingBottom: 12}}>
        <Button style={{
          margin: "0 auto",
          color: myMemberStatus ? theme.palette.error.main : theme.palette.success.main
        }} variant="outlined" onClick={changeParticitationStatus}>
          {myMemberStatus ? "Не участвовать" : "Участвовать"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default UserActivity;
