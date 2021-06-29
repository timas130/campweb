function PageVideo(props) {
  return (
    // I don't know how that even works
    <div style={{position: "relative", paddingTop: "56.25%"}}>
      <iframe
        src={"https://www.youtube-nocookie.com/embed/" + props.page.videoId} frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%"
        }} title={props.page.videoId + "@youtube"}
      ></iframe>
    </div>
  );
}

export default PageVideo;
