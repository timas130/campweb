import "./Page.css";
import PageText from "./PageText";
import PageImage from "./PageImage";
import PageImages from "./PageImages";
import PageVideo from "./PageVideo";
import PageQuote from "./PageQuote";
import PageLink from "./PageLink";
import API from "../../api/api.json";

function Page(props) {
  switch (props.page["J_PAGE_TYPE"]) {
    case API["PAGE_TYPE_TEXT"]:
      return (<div className="page"><PageText page={props.page} /></div>);
    case API["PAGE_TYPE_IMAGE"]:
      return (<div className="page"><PageImage page={props.page} /></div>);
    case API["PAGE_TYPE_IMAGES"]:
      return (<div className="page"><PageImages page={props.page} /></div>);
    case API["PAGE_TYPE_LINK"]:
      return (<div className="page"><PageLink page={props.page} /></div>);
    case API["PAGE_TYPE_QUOTE"]:
      return (<div className="page"><PageQuote page={props.page} /></div>);
    case API["PAGE_TYPE_VIDEO"]:
      return (<div className="page"><PageVideo page={props.page} /></div>);
    default:
      return (<div className="page">
        Error: unknown page type: {
          Object.keys(API).filter(
            i => i.startsWith("PAGE_TYPE_") &&
                 API[i] === props.page["J_PAGE_TYPE"]
          )[0] || props.page["J_PAGE_TYPE"]
        }
      </div>);
  }
}

export default Page;
