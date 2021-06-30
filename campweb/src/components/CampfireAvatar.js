import { Avatar, Badge, withStyles } from "@material-ui/core";
import { theme } from "../App";
import CampfireImage from "./CampfireImage";
import { protoadmins } from "../api/ApiContext";
import { blue, green, grey, orange, red } from "@material-ui/core/colors";

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

function badgeColorForAccount(account) {
  if (account["J_NAME"].startsWith("Bot#")) {
    return grey[800];
  } else if (protoadmins.includes(account["J_ID"])) {
    return orange.A700;
  } else if (account.karma30 >= 70000 && account["J_LVL"] >= 700) {
    return red[700];
  } else if (account.karma30 >= 300 && account["J_LVL"] >= 400) {
    return blue[700];
  } else {
    return green[700];
  }
}

function CampfireAvatar(props) {
  const badgeBG = badgeColorForAccount(props.account);

  // TODO: sponsor particles
  return (
    <Badge
      overlap="circle"
      anchorOrigin={{
        vertical: "bottom", horizontal: "right"
      }}
      badgeContent={
        <SmallAvatar style={{
          fontSize: 12,
          background: badgeBG,
          color: theme.palette.getContrastText(badgeBG)
        }} variant={theme.avatarVariant}>
          {Math.floor(props.account["J_LVL"] / 100)}
        </SmallAvatar>
      }
      className={props.className}
      style={props.style}
    >
      <Avatar variant={theme.avatarVariant} alt={props.account["J_NAME"]}>
        <CampfireImage 
          style={{
            width: "100%"
          }}
          id={props.account["J_IMAGE_ID"]}
          backdrop={props.backdrop}
        />
      </Avatar>
    </Badge>
  );
}

export default CampfireAvatar;
 