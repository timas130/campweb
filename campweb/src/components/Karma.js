import { theme } from "../index";

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
      {
        props.cof ?
        ((props.amount) / 100).toString() + "x" :
        ((props.amount) / 100).toFixed()
      }
    </span>
  );
}

export default Karma;
