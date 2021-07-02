import { Card, CardHeader, CardContent, withStyles, LinearProgress, Box, Typography, IconButton } from "@material-ui/core";
import { Check, Refresh } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../api/ApiContext";
import RPostPagePollingGet from "../../api/requests/post/RPostPagePollingGet";
import { theme } from "../../App";
import RPostPagePollingVote from "../../api/requests/post/RPostPagePollingVote";

const ThickLinearProgress = withStyles((theme) => ({
  root: {
    height: 50,
    borderRadius: 5
  },
  bar: {
    background: theme.palette.primary.dark
  }
}))(LinearProgress);

function PollOption(props) {
  const percent = Math.floor(props.result.count / props.totalVotes * 100);

  return (
    <Box
      position="relative" onClick={props.onClick}
      marginBottom="5px" style={{cursor: "pointer"}}
    >
      <ThickLinearProgress variant="determinate" value={percent} />
      <Box
        position="absolute" display="flex"
        top={0} left={0}
        height="100%" width="100%"
        alignItems="center"
        paddingLeft="10px" paddingRight="10px"
      >
        {props.result.myVote ? <Check style={{marginRight: 5}} /> : ""}
        <Typography variant="body1" style={{
          color: theme.palette.text.primary,
          fontWeight: "bold"
        }}>
          {props.option}
        </Typography>
        <Box marginLeft="auto" textAlign="center">
          <Typography variant="body1">{percent}%</Typography>
          <Typography variant="body2" color="textSecondary">({props.result.count})</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function PagePoll(props) {
  const minLevel = props.page.minLevel;
  const minKarma = props.page.minKarma;

  const apiClient = useContext(ApiContext);
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(1);
  const [voted, setVoted] = useState(false);

  async function loadResults() {
    setResults([]);
    setTotalVotes(1);

    const resp = JSON.parse((await apiClient.makeRequest(
      new RPostPagePollingGet(props.page.pollingId)
    )).tags);

    let results = [];
    let totalVotes = 0;
    resp.forEach(el => {
      results[el.itemId] = el;
      totalVotes += el.count;
      if (el.myVote) setVoted(true);
    });
    setResults(results);
    setTotalVotes(totalVotes);
  }

  useEffect(() => {
    loadResults();
  // eslint-disable-next-line
  }, []);

  const onVote = async idx => {
    if (voted) {
      apiClient.onError("Вы уже голосовали.");
      return;
    }

    await apiClient.makeRequest(
      new RPostPagePollingVote(props.sourceId, props.page.pollingId, idx)
    );
    let newResults = results;
    newResults[idx].count++;
    newResults[idx].myVote = true;
    setVoted(true);
    setResults(newResults);
  };

  return (
    <Card>
      <CardHeader
        title={props.page.title}
        subheader={
          (minKarma || minLevel) ?
          "Ограничения:" + (minLevel ? " Уровень " + (minLevel / 100) : "") +
                           (minKarma ? " Карма " + (minKarma / 100) : "") :
          ""
        }
        action={
          <IconButton onClick={loadResults}><Refresh /></IconButton>
        }
      />
      <CardContent>
        {JSON.parse(props.page.options)
          .map((option, idx) =>
            <PollOption
              option={option} onClick={() => onVote(idx)}
              result={results[idx] || {count: 0, myVote: false}}
              totalVotes={totalVotes} key={idx}
            />
          )}
      </CardContent>
    </Card>
  );
}

export default PagePoll;
