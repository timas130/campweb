import Page from "./Page";
import API from "../../api/api.json";

// Don't even try to understand what my shitcode does.
// Even I can't. Everything I know is that is works.

function spoilersNest(pages, start, len) {
  let result = [];
  let i = start;
  for (; i < start + Math.min(len || pages.length, pages.length - start);) {
    if (pages[i]["J_PAGE_TYPE"] === API["PAGE_TYPE_SPOILER"]) {
      let spoilerContent = spoilersNest(pages, i + 1, pages[i].count);
      spoilerContent[0].name = pages[i].name;
      spoilerContent[0].J_PAGE_TYPE = API["PAGE_TYPE_SPOILER"];
      result.push(spoilerContent[0]);
      i += spoilerContent[1] + 1;
    } else {
      result.push(pages[i]);
      i++;
    }
  }
  return [result, i - start];
}

function nestToElements(nested, sourceId, onEdit, onDelete, offset) {
  let length = 0;
  return [nested.map((page, idx) => {
    if (page.J_PAGE_TYPE === API["PAGE_TYPE_SPOILER"]) {
      const els = nestToElements(page, sourceId, onEdit, onDelete, offset + length + 1);
      length += els[1] + 1;
      return <Page onEdit={onEdit} onDelete={onDelete} key={idx}
                   idx={offset + length - els[1] - 1}
                   page={{name: page.name, J_PAGE_TYPE: API["PAGE_TYPE_SPOILER"]}}>
        {els[0]}
      </Page>;
    } else {
      length++;
      return <Page onEdit={onEdit} onDelete={onDelete}
                   sourceId={sourceId} page={page} key={idx}
                   idx={offset + length - 1} />;
    }
  }), length];
}

function Pages(props) {
  const nested = spoilersNest(props.pages, 0)[0];

  return nestToElements(nested, props.sourceId, props.onEdit, props.onDelete, 0)[0];
}

export default Pages;
