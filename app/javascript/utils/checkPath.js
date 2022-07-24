export function checkPath(correctPath) {
    const path = location.pathname;
    if (path === correctPath) { return true; };
}
