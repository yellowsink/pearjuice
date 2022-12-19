import * as Gluon from "@gluon-framework/gluon";
import onLoad from "./renderer.js";
import injectCommon, { getUrl } from "./common/index.js";
import { get, load } from "./config.js";
import { ensureWidevine } from "./widevine.js";
import onboarding from "./onboarding/index.js";

(async () => {
	await load();

	let widevinePromise = ensureWidevine();

	// run widevine in parallel with onboarding!
	if (!get("onboarded")) await onboarding();
	await widevinePromise;

	const Window = await Gluon.open(getUrl(), { onLoad });

	await injectCommon(Window);
})();
