import * as Gluon from "@gluon-framework/gluon";
import onLoad from "./renderer.js";
import css from "./css.js";
import { set, get, load } from "./config.js";
import icons from "./icons.js";
import { ensureWidevine } from "./widevine.js";
import onboarding from "./onboarding/index.js";

const getUrl = () => `https://${get("beta") ? "beta." : ""}music.apple.com/${get("region")}`;

(async () => {
	await load();

	let widevinePromise = ensureWidevine();

	// run widevine in parallel with onboarding!
	if (!get("onboarded")) await onboarding();
	await widevinePromise;

	const Window = await Gluon.open(getUrl(), { onLoad });

	Window.ipc.on("get css", () => css);
	Window.ipc.on("get url", getUrl);
	Window.ipc.on("get icon", (k) => btoa(icons[k]));

	Window.ipc.on("config get", get);
	Window.ipc.on("config set", set);
})();
