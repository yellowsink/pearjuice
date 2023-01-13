import * as Gluon from "@gluon-framework/gluon";
// TODO: when this is ready
// import {openWithWv, ensureWidevine} from "@gluon-framework/widevine"
import onLoad from "./renderer.js";
import injectCommon, { getUrl } from "./common/index.js";
import { get, load } from "./config.js";
import { ensureWidevine } from "./widevine.js";
import onboarding from "./onboarding/index.js";

(async () => {
	await load();

	// ensureWidevine(); // just fire this off lol
	let widevinePromise = ensureWidevine();

	// run widevine in parallel with onboarding!
	if (!get("onboarded")) await onboarding();
	await widevinePromise;

	// const Window = await openWithWv(getUrl(), { onLoad });
	const Window = await Gluon.open(getUrl(), { onLoad });

	await injectCommon(Window);
})();
