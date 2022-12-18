import * as Gluon from "@gluon-framework/gluon";
import onLoad from "./renderer.js";
import css from "./css.js";
import { batchSet, get, load, set } from "./config.js";
import icons from "./icons.js";
import { ensureWidevine } from "./widevine.js";

const getUrl = () => `https://${get("beta") ? "beta." : ""}music.apple.com/${get("region")}`;

(async () => {
	await ensureWidevine();

	await load();

	const Window = await Gluon.open(getUrl(), { onLoad });

	Window.ipc.on("get css", () => css);
	Window.ipc.on("get url", getUrl);
	Window.ipc.on("get icon", (k) => btoa(icons[k]));

	Window.ipc.on("config get", get);
	//Window.ipc.on("config set", ([k, v]) => set(k, v));
	Window.ipc.on("config batch set", batchSet);
})();
