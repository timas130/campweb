import "./Page.css";
import PageText from "./PageText";
import PageImage from "./PageImage";
import PageImages from "./PageImages";
import PageVideo from "./PageVideo";
import PageQuote from "./PageQuote";
import PageLink from "./PageLink";

function Page(props) {
  switch (props.page["J_PAGE_TYPE"]) {
    case 1:
      return (<div className="page"><PageText page={props.page} /></div>);
    case 2:
      return (<div className="page"><PageImage page={props.page} /></div>);
    case 3:
      return (<div className="page"><PageImages page={props.page} /></div>);
    case 9:
      return (<div className="page"><PageVideo page={props.page} /></div>);
    case 5:
      return (<div className="page"><PageQuote page={props.page} /></div>);
    case 4:
      return (<div className="page"><PageLink page={props.page} /></div>);
    default:
      return (<div className="page">Error: unknown page type</div>);
  }
}

export default Page;
