import * as Gluon from "@gluon-framework/gluon";
import {ensureWidevine} from "@gluon-framework/widevine"
import onLoad from "./renderer.js";
import injectCommon, { getUrl } from "./common/index.js";
import { get, load } from "./config.js";
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
