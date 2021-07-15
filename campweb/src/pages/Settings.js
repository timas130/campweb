import {Box, Button, Checkbox, Container, FormControlLabel} from "@material-ui/core";
import CampfireAvatar from "../components/CampfireAvatar";
import {useState} from "react";

const badgeSquaredInitial = window.localStorage.getItem("badgeRadius") === "4px";
const avatarVariantInitial = window.localStorage.getItem("avatarVariant") === "rounded";
const testAccount = {
  sponsor: 0,
  J_LVL: 250,
  J_ID: 238767,
  J_NAME: "sit",
  sponsorTimes: 0,
  karma30: 72717,
  J_IMAGE_ID: 1121516
};

function Settings() {
  const [badgeSquared, setBadgeSquared] = useState(badgeSquaredInitial);
  const [avatarVariant, setAvatarVariant] = useState(avatarVariantInitial);

  const onSave = () => {
    window.localStorage.setItem("badgeRadius", badgeSquared ? "4px" : "50%");
    window.localStorage.setItem("avatarVariant", avatarVariant ? "rounded" : "circle");
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <h1>Настройки</h1>
      <h2>Стиль</h2>
      <Box display="flex" marginBottom={4}>
        <CampfireAvatar
          style={{marginRight: 16}}
          account={testAccount}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary" checked={badgeSquared}
              onChange={() => setBadgeSquared(! badgeSquared)}
            />
          }
          label="Квадратный уровень"
        />
      </Box>
      <Box display="flex" marginBottom={4}>
        <CampfireAvatar
          style={{marginRight: 16}}
          account={testAccount}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary" checked={avatarVariant}
              onChange={() => setAvatarVariant(! avatarVariant)}
            />
          }
          label="Квадратный аватар"
        />
      </Box>

      <Button variant="contained" color="primary" onClick={onSave}>
        Сохранить и перезагрузить
      </Button>
    </Container>
  );
}

export default Settings;
