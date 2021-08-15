export function showContents(ids) {
  ids.forEach((id) => {
    document.getElementById(id).style.display = "";
  })
}
