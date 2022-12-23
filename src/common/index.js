import renderer from "./renderer.js";
import css from "./css.js";
import icons from "../icons.js";
import {get, set} from "../config.js";
import settings from "./settings.js";

export const getUrl = () => `https://${get("beta") ? "beta." : ""}music.apple.com/${get("region")}`;

async function evalIn(Window, src) {
	const expr = typeof src === 'string' ? src : `(${src.toString()})()`;

	await Window.cdp.send(`Runtime.evaluate`, { expression: expr });
	await Window.cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: expr });
}

export default async (Window) => {
	Window.ipc.on("get css", () => css);
	Window.ipc.on("get url", getUrl);
	Window.ipc.on("get icon", (k) => "data:image/svg+xml;base64," + btoa(icons[k]));

	Window.ipc.on("config get", get);
	Window.ipc.on("config set", set);

	await evalIn(Window, renderer);
	await evalIn(Window, settings);
}