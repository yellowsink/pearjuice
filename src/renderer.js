export default () => {
	// this function does not sanitize scripts. be careful.
	// it also only returns one element, not multiple.
	function template(str) {
		const parent = document.createElement("_");
		parent.innerHTML = str;
		const child = parent.firstElementChild;
		parent.replaceChildren();

		return child;
	}

	function injectCss(css) {
		document.head.append(template(`<style>${css}</style>`));
	}

	const cfgGet = async (k) => Gluon.ipc.send("config get", k);
	const cfgSet = async (k, v) => Gluon.ipc.send("config set", [k, v]);

	async function until(condition) {
		while (!condition()) {
			// noinspection JSCheckFunctionSignatures
			await new Promise(setTimeout);
		}
		return condition();
	}

	// END utilities

	addEventListener("load", () => {
		Gluon.ipc.send("get css").then(injectCss);

		// noinspection JSIgnoredPromiseFromCall
		autoSignIn();
		// noinspection JSIgnoredPromiseFromCall
		accountContextMenu();
	});

	// START tweaks

	async function autoSignIn() {
		await until(() => document.querySelector("amp-lcd"));
		const mkInstance = await until(() => MusicKit.getInstance());

		if (!mkInstance.isAuthorized) {
			const btn = await until(() => document.querySelector("amp-lcd .auth-content > button"));
			btn.click();
		}
	}

	async function accountContextMenu() {
		const cmCont = await until(() => document.querySelector("amp-lcd .account-menu > .context-menu-container"));
		console.log(cmCont);
		// TODO
	}
};
