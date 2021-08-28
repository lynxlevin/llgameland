export const getElementsByIds = (array) => {
  const doms = [];
  array.forEach((id) => {
    const dom = document.getElementById(id);
    doms.push(dom);
  });
  return doms;
}