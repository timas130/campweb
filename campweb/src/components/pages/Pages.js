import Page from "./Page";
import API from "../../api/api.json";
import PageSpoiler from "./PageSpoiler";

function spoilersNest(pages, start, len) {
  let result = [];
  let i = start;
  for (; i < start + Math.min(len || pages.length, pages.length - start);) {
    if (pages[i]["J_PAGE_TYPE"] === API["PAGE_TYPE_SPOILER"]) {
      let spoilerContent = spoilersNest(pages, i + 1, pages[i].count);
      spoilerContent[0].name = pages[i].name;
      result = [...result, spoilerContent[0]];
      i += spoilerContent[1] + 1;
    } else {
      result.push(pages[i]);
      i++;
    }
  }
  return [result, i - start];
}

function nestToElements(nested, sourceId) {
  return nested.map((page, idx) => {
    if (page[0]) { // shitcodier than ever
      return <PageSpoiler key={idx} name={page.name}>{nestToElements(page)}</PageSpoiler>;
    } else {
      return <Page sourceId={sourceId} page={page} key={idx} />;
    }
  });
}

function Pages(props) {
  const nested = spoilersNest(props.pages, 0)[0];

  return nestToElements(nested, props.sourceId);
}

export default Pages;
