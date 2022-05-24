import { Parser } from 'commonmark';

export function getImages(markdown: string) {
  if (!markdown) {
    return { list: null, uniqueSrcList: null, nodeList: [] };
  }
  const parsed = new Parser().parse(markdown);
  const walker = parsed.walker();
  let event;
  const nodeList = [];
  // eslint-disable-next-line no-cond-assign
  while ((event = walker.next())) {
    const { node } = event;
    if (node.type === 'image' && node.destination) {
      nodeList.push(node);
    }
  }
  const list = nodeList.map((node) => node.destination);
  const uniqueSrcList = [...new Set(list)];

  return {
    list,
    uniqueSrcList,
    nodeList,
  };
}
