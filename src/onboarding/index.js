import * as Gluon from "@gluon-framework/gluon";
import { set } from "../config.js";
import injectCommon from "../common/index.js";

export default () =>
	new Promise(async (resolve) => {
		const Window = await Gluon.open("index.html");

		Window.ipc.on("onboarding complete", async () => {
			await set({ onboarded: true });
			await Window.cdp.send("Browser.close");
			resolve();
		});

		await Window.page.loaded;

		await injectCommon(Window);
	});
