import * as Gluon from "@gluon-framework/gluon";
import { relative } from "../pathutils.js";
import { set } from "../config.js";
import injectCommon from "../common/index.js";

export default () =>
	new Promise(async (resolve) => {
		const Window = await Gluon.open("file://" + relative(import.meta.url, "index.html"), {});

		Window.ipc.on("onboarding complete", async () => {
			await set({ onboarded: true });
			await Window.cdp.send("Browser.close");
			resolve();
		});

		await injectCommon(Window);
	});
