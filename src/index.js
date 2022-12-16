import * as Gluon from "@gluon-framework/gluon";
import onLoad from "./renderer.js";
import css from "./css.js";

Gluon.open("https://music.apple.com", {onLoad})
	.then(Window => {

		Window.ipc.on("renderer ready", () => {
			console.log("hello!");

			Window.ipc.send("inject css", { css })
		})

	});