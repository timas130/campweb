import { Toolbar, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { useHistory } from "react-router";

function AppToolbar(props) {
  const history = useHistory();

  return (
    <Toolbar>
      <IconButton onClick={history.goBack}>
        <ArrowBack />
      </IconButton>
    </Toolbar>
  );
}

export default AppToolbar;
