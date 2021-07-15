import { useContext, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ApiContext } from "../../api/ApiContext";
import { useLoggedIn } from "../../App";
import { CircularProgress, Container, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction } from "@material-ui/core";
import RAccountsKarmaInFandomsGetAll, { count as karmaCount } from "../../api/requests/accounts/RAccountsKarmaInFandomsGetAll";
import InView from "react-intersection-observer";
import CampfireImage from "../../components/CampfireImage";
import KarmaCount from "../../components/Karma";

function ProfileKarma(props) {
  const apiClient = useContext(ApiContext);
  const history = useHistory();
  const { accountId } = useParams();

  const [karma, setKarma] = useState([]);
  const [karmaEnd, setKarmaEnd] = useState(false);

  useLoggedIn(history, apiClient);

  async function loadMoreKarma() {
    const resp = JSON.parse((await apiClient.makeRequest(
      new RAccountsKarmaInFandomsGetAll(
        parseInt(accountId),
        karma.length
      )
    )).karma);
    setKarma([...karma, ...resp]);
    console.log(resp);
    if (resp.length < karmaCount) setKarmaEnd(true);
  }

  return (
    <Container maxWidth="sm">
      <List>
        {karma.map((el, idx) =>
          <ListItem key={idx} button onClick={() => history.push("/fandom/" + el.fandom.id)}>
            <ListItemAvatar>
              <Avatar>
                <CampfireImage style={{width: "100%"}} id={el.fandom.imageId} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={el.fandom.name} />
            <ListItemSecondaryAction>
              <KarmaCount amount={el.karmaCount} />
            </ListItemSecondaryAction>
          </ListItem>
        )}
        {
          !karmaEnd &&
          <InView
            as="div" onChange={inView => inView && loadMoreKarma()}
            style={{width: "100%", textAlign: "center", padding: 20}}
          ><CircularProgress /></InView>
        }
      </List>
    </Container>
  );
}

export default ProfileKarma;
