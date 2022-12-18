import { URL } from "url";

export const relative = (root, path) => new URL(path, root).pathname;