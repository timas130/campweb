import { Typography } from "@material-ui/core";
import FormattedText from "../FormattedText";
import {
  AccessTime,
  AccountBalance,
  AccountBox,
  AccountCircle,
  Add,
  Alarm,
  AllInclusive,
  ArrowBack,
  AttachFile,
  Book,
  Bookmark,
  BorderAll,
  BorderBottom,
  BorderLeft,
  BorderRight,
  BorderTop,
  Brush,
  Cached,
  CheckBox,
  Clear,
  Close,
  CloudDownload,
  Code,
  DirectionsBike,
  Done,
  DoneAll,
  Edit,
  Email,
  ExitToApp,
  Favorite,
  FileCopy,
  Folder,
  FormatQuote,
  Gavel,
  Group,
  Help,
  InfoOutlined,
  InsertDriveFile,
  InsertLink,
  InsertPhoto,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  Landscape,
  Language,
  Lock,
  Menu,
  Mic,
  ModeComment,
  MoreVert,
  Notifications,
  NotInterested,
  Person,
  Pets,
  PlayArrow,
  Reply,
  Rowing,
  Search,
  Security,
  Send,
  Settings,
  Share,
  Star,
  StarBorder,
  TextFields,
  ThumbsUpDown,
  Translate, TrendingFlat,
  TrendingUp,
  Tune, WbIncandescent, Whatshot,
  Widgets
} from "@material-ui/icons";

const icons = [
  false,
  <ArrowBack />,
  <Menu />,
  <KeyboardArrowRight />,
  <KeyboardArrowLeft />,
  <CloudDownload />,
  <Share />,
  <KeyboardArrowUp />,
  <KeyboardArrowDown />,
  <FileCopy />,
  <Folder />,
  <InsertDriveFile />,
  <Mic />,
  <Clear />,
  <Lock />,
  <AccessTime />,
  <AccountBalance />,
  <AccountBox />,
  <AccountCircle />,
  <Add />,
  <Alarm />,
  <AllInclusive />,
  <AttachFile />,
  <Bookmark />,
  <Brush />,
  <Close />, // FIXME: ic_burst_mode_white_24dp
  <Cached />,
  <CheckBox />,
  <Clear />,
  <Code />,
  <DoneAll />,
  <Done />,
  <Email />,
  <ExitToApp />,
  <Favorite />,
  <FormatQuote />,
  <Gavel />,
  <Group />,
  <Help />,
  <InfoOutlined />,
  <InsertLink />,
  <InsertLink />,
  <InsertPhoto />,
  <KeyboardArrowDown />,
  <KeyboardArrowUp />,
  <Landscape />,
  <Language />,
  <ModeComment />,
  <Edit />,
  <MoreVert />,
  <Notifications />,
  <Person />,
  <PlayArrow />,
  <Reply />,
  <Rowing />,
  <Search />,
  <Security />,
  <Send />,
  <Settings />,
  <Share />,
  <StarBorder />,
  <Star />,
  <TextFields />,
  <ThumbsUpDown />,
  <Translate />,
  <TrendingFlat />,
  <TrendingUp />,
  <Tune />,
  <Widgets />,
  <Book />,
  <Pets />,
  <DirectionsBike />,
  <BorderAll />,
  <BorderLeft />,
  <BorderTop />,
  <BorderRight />,
  <BorderBottom />,
  <NotInterested />,
  <WbIncandescent />,
  <Whatshot />
];

function PageText(props) {
  return (<Typography variant="body1" style={{
    textAlign:
      props.page.align === 0 ? "left" :
      props.page.align === 1 ? "right" :
      props.page.align === 2 ? "center" :
      "left",
    fontSize:
      props.page["J_SIZE"] === 0 ? "medium" :
      props.page["J_SIZE"] === 1 ? "large" :
      "medium"
  }}>
    {props.page.icon ? icons[props.page.icon] : ""}&nbsp;
    <FormattedText text={props.page["J_TEXT"]} />
  </Typography>);
}

export default PageText;
