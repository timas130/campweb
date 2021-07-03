import {Toolbar, IconButton, Tooltip} from "@material-ui/core";
import {ArrowBack, ExitToApp} from "@material-ui/icons";
import { useHistory } from "react-router";
import {useContext} from "react";
import {ApiContext} from "../api/ApiContext";

function AppToolbar(props) {
  const history = useHistory();
  const apiClient = useContext(ApiContext);

  const logout = () => {
    apiClient.clearLoginToken();
    history.push("/login");
  };

  return (
    <Toolbar>
      <IconButton onClick={history.goBack}>
        <ArrowBack />
      </IconButton>

      <Tooltip style={{marginLeft: "auto"}} title="Выйти из аккаунта">
        <IconButton onClick={logout}>
          <ExitToApp />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

export default AppToolbar;
