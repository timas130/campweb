import { Container, TextField, ButtonGroup, Button, Link, Backdrop, CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useContext, useEffect, useState } from "react";
import {useHistory, useLocation} from "react-router";
import { ApiContext } from "../api/ApiContext";
import API from "../api/api.json";
import RAccountsLogin from "../api/requests/accounts/RAccountsLogin";
import logo from "../logo.svg";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const apiClient = useContext(ApiContext);
  const location = useLocation();
  const { next } = location.state || {next: {pathname: "/feed"}};

  const onLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const req = new RAccountsLogin(API["LANGUAGE_RU"]);
      if (email && password) apiClient.setLoginTokenEmail(email, password);
      console.log("login", await apiClient.makeRequest(req));
      if (! apiClient.accessToken)
        throw new Error("Server didn't send access token!");
      setLoading(false);

      history.replace(next);
    } catch (e) {
      setError(e);
      console.error("error", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiClient.loginToken) onLogin();
    else setLoading(false);
  // eslint-disable-next-line
  }, [apiClient, history]);

  return (
    <Container maxWidth="xs">
      <div className="login">
        <img src={logo} alt="Campfire" width="100" className="login__logo" />
        <Alert severity="warning">
          <AlertTitle>Важный дисклеймер</AlertTitle>
          Не хочу напугать, но чтобы не было недопониманий я скажу, что
          все запросы к серверам Campfire идут через мой прокси, потому
          что прямое подключение невозможно. Этот прокси не перехватывает
          запросы, он их даже никак не перепаковывает. Чтобы вы в этом
          были уверены, вы можете просмотреть&nbsp;
          <Link href="https://github.com/timas130/campweb" target="_blank">исходный код</Link> и
          самостоятельно запустить прокси и собрать клиентскую часть.
        </Alert>
        <Alert severity="info" style={{width: "100%", marginTop: 5, marginBottom: 10}}>
          Так как прокси работает на бесплатном хосте (Heroku), соединение
          может быть долгое. Если грузит дольше 30 секунд — перезагрузите
          страницу.
        </Alert>

        {error && <Alert severity="error" style={{width: "100%", marginBottom: 10}}>
          <AlertTitle>Не удалось войти:</AlertTitle>
          {error}
        </Alert>}

        <h1 className="login__title">Добро пожаловать</h1>
        <div className="login__form">
          <TextField value={email} onChange={(ev) => setEmail(ev.target.value)}
            label="E-mail" variant="outlined" type="email" fullWidth />
          <TextField value={password} onChange={(ev) => setPassword(ev.target.value)}
            label="Пароль" variant="outlined" type="password" fullWidth />

          <ButtonGroup>
            <Button disabled>Создать аккаунт</Button>
            <Button onClick={onLogin}>Войти</Button>
          </ButtonGroup>
        </div>

        <Backdrop style={{zIndex: 99999}} open={loading}><CircularProgress /></Backdrop>
      </div>
    </Container>
  );
}

export default Login;
