import "./Page.css";
import PageText from "./PageText";
import PageImage from "./PageImage";
import PageImages from "./PageImages";
import PageVideo from "./PageVideo";
import PageQuote from "./PageQuote";
import PageLink from "./PageLink";
import API from "../../api/api.json";
import PagePoll from "./PagePoll";
import {theme} from "../../index";
import {IconButton} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons";
import PageSpoiler from "./PageSpoiler";

function Page(props) {
  let el;
  switch (props.page["J_PAGE_TYPE"]) {
    case API["PAGE_TYPE_TEXT"]:
      el = <PageText page={props.page} />;
      break;
    case API["PAGE_TYPE_IMAGE"]:
      el = <PageImage page={props.page} />;
      break;
    case API["PAGE_TYPE_IMAGES"]:
      el = <PageImages page={props.page} />;
      break;
    case API["PAGE_TYPE_LINK"]:
      el = <PageLink page={props.page} />;
      break;
    case API["PAGE_TYPE_QUOTE"]:
      el = <PageQuote page={props.page} />;
      break;
    case API["PAGE_TYPE_VIDEO"]:
      el = <PageVideo page={props.page} />;
      break;
    case API["PAGE_TYPE_POLLING"]:
      el = <PagePoll sourceId={props.sourceId} page={props.page} />;
      break;
    case API["PAGE_TYPE_SPOILER"]:
      el = <PageSpoiler sourceId={props.sourceId} name={props.page.name}>
        {props.children}
      </PageSpoiler>
      break;
    default:
      return (<div className="page" style={{color: theme.palette.error.main}}>
        Error: unknown page type: {
          Object.keys(API).filter(
            i => i.startsWith("PAGE_TYPE_") &&
                 API[i] === props.page["J_PAGE_TYPE"]
          )[0] || props.page["J_PAGE_TYPE"]
        }
      </div>);
  }

  return (
    <div className={"page " + (props.onEdit ? "page_editable" : "")}>
      {el}
      {
        props.onEdit ?
        <div className="page__edit">
          <IconButton size="small" onClick={() => props.onDelete(props.idx)}>
            <Delete fontSize="small" />
          </IconButton><br />
          <IconButton size="small" onClick={() => props.onEdit(props.idx)}>
            <Edit fontSize="small" />
          </IconButton>
        </div> : ""
      }
    </div>
  );
}

export default Page;
