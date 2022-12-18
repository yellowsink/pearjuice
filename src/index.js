import * as Gluon from "@gluon-framework/gluon";
import onLoad from "./renderer.js";
import css from "./css.js";
import { load, get, set } from "./config.js";

(async () => {
	await load();

	const url = `https://${get("beta") ? 'beta.' : ''}music.apple.com/${get("region")}`;

	const Window = await Gluon.open(url, { onLoad });

	Window.ipc.on("get css", () => css);
	Window.ipc.on("config get", get);
	Window.ipc.on("config set", ([k, v]) => set(k, v));
})();
