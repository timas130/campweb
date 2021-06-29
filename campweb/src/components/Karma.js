import { theme } from "../App";

function Karma(props) {
  return (
    <span style={{
      color:
        props.amount > 0 ? theme.palette.success.main :
        props.amount < 0 ? theme.palette.error.main :
        theme.palette.text.primary,
      fontWeight: "bold",
      textAlign: "center"
    }}>
      {(props.amount) / 100}
    </span>
  );
}

export default Karma;
