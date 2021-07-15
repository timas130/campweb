import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Divider, Grid, IconButton, InputAdornment, SvgIcon,
  TextField,
  Typography,
  useMediaQuery
} from "@material-ui/core";
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
  Folder, FormatAlignCenter, FormatAlignLeft, FormatAlignRight,
  FormatQuote, FormatSize,
  Gavel,
  Group,
  Help,
  InfoOutlined,
  InsertDriveFile, InsertEmoticon,
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
import {theme} from "../../App";
import {useState} from "react";
import API from "../../api/api.json";

const icons = [
  <SvgIcon />,
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
    {props.page.icon ? <>{icons[props.page.icon]}&nbsp;</> : ""}
    <FormattedText style={{verticalAlign: "top"}} text={props.page["J_TEXT"]} />
  </Typography>);
}
export default PageText;

function ChooseIcon(props) {
  const { icon, setIcon, open, onClose } = props;

  return (
    <Dialog open={open} maxWidth="xs" fullWidth={false} onClose={onClose}>
      <DialogTitle>Выберите иконку</DialogTitle>
      <DialogContent>
        <Grid container>
          {icons.map((iconEl, idx) =>
            <Grid item xs={2} sm={1} key={idx}>
              <IconButton color={
                icon === idx ? "primary" : "default"
              } size="small" onClick={() => {
                setIcon(idx);
                onClose();
              }}>
                {iconEl}
              </IconButton>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
export function PageTextCreate(props) {
  const { onClose, open } = props;
  const [page, setPage] = useState({
    ...props.page,
    J_SIZE: props.page["J_SIZE"] || 0,
    icon: props.page.icon || 0,
    align: props.page.align || 0,
    J_TEXT: props.page["J_TEXT"] || "",
    J_PAGE_TYPE: API["PAGE_TYPE_TEXT"]
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [iconChooserOpen, setIconChooserOpen] = useState(false);

  const toggleSize = () => {
    if (page["J_SIZE"] === 1) {
      setPage({...page, J_SIZE: 0});
    } else {
      setPage({...page, J_SIZE: 1});
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Текст</DialogTitle>
      <DialogContent>
        <TextField
          InputProps={{
            startAdornment: (!!page.icon && <InputAdornment position="start">
              {icons[page.icon]}
            </InputAdornment>)
          }}
          placeholder="Введите текст страницы"
          multiline fullWidth value={page["J_TEXT"]}
          onChange={(ev) => setPage({...page, J_TEXT: ev.target.value})}
        />
      </DialogContent>
      <DialogActions style={{justifyContent: "flex-start"}}>
        <IconButton size="small" onClick={toggleSize} color={
          page["J_SIZE"] === 1 ? "primary" : "default"
        }>
          <FormatSize fontSize="small" />
        </IconButton>

        <ChooseIcon
          open={iconChooserOpen}
          onClose={() => setIconChooserOpen(false)}
          icon={page.icon} setIcon={newIcon => setPage({...page, icon: newIcon})}
        />
        <IconButton
          size="small" color={page.icon ? "primary" : "default"}
          onClick={() => setIconChooserOpen(true)}
        >
          {page.icon ? icons[page.icon] : <InsertEmoticon fontSize="small" />}
        </IconButton>

        <Divider orientation="vertical" flexItem />

        <IconButton
          size="small" onClick={() => setPage({...page, align: 0})}
          color={page.align === 0 ? "primary" : "default"}
        >
          <FormatAlignLeft fontSize="small" />
        </IconButton>
        <IconButton
          size="small" onClick={() => setPage({...page, align:2})}
          color={page.align === 2 ? "primary" : "default"}
        >
          <FormatAlignCenter fontSize="small" />
        </IconButton>
        <IconButton
          size="small" onClick={() => setPage({...page, align: 1})}
          color={page.align === 1 ? "primary" : "default"}
        >
          <FormatAlignRight fontSize="small" />
        </IconButton>

        <IconButton size="small" style={{marginLeft: "auto"}}
                    color="primary" onClick={() => onClose(page)}
                    disabled={! page["J_TEXT"]}>
          <Done fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClose({})}>
          <Close fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
