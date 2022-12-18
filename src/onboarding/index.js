import * as Gluon from "@gluon-framework/gluon";
import { relative } from "../pathutils.js";
import { get, set } from "../config.js";

export default () =>
	new Promise((resolve) => {
		Gluon.open("file://" + relative(import.meta.url, "index.html"), {
			onLoad() {}
		}).then((Window) => {
			Window.ipc.on("onboarding complete", async () => {
				await set({ onboarded: true });
				await Window.cdp.send("Browser.close");
				resolve();
			});

			Window.ipc.on("config get", get);
			Window.ipc.on("config set", set);
		});
	});
