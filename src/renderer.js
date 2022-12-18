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
	const cfgSet = async (o) => Gluon.ipc.send("config set", o);

	const getCss = async () => Gluon.ipc.send("get css");
	const getUrl = async () => Gluon.ipc.send("get url");
	const getIcon = async (i) => Gluon.ipc.send("get icon", i);

	async function until(condition) {
		while (!condition()) {
			// noinspection JSCheckFunctionSignatures
			await new Promise(setTimeout);
		}
		return condition();
	}

	const modalItems = [
		["region", "Apple Music Region", "text"],
		["beta", "Opt-in to AM Beta", "checkbox"]
	]

	let modalIsOpen = false;
	async function showModal() {
		if (modalIsOpen) return;

		const container = template(`
<div class="pj-modal-root">
	<div class="pj-modal">
		<div class="pj-modal-header">
			<button class="pj-modal-close"></button>
			PearJuice settings
		</div>
		<div class="pj-modal-content"></div>
	</div>
</div>
`);

		modalIsOpen = true;
		document.body.append(container);

		const content = container.getElementsByClassName("pj-modal-content")[0];
		const close = container.getElementsByClassName("pj-modal-close")[0];

		for (const item of modalItems) {
			//const val = await cfgGet(item[0]);

			const val = item[2] == "checkbox"
				? (await cfgGet(item[0]) ? "checked" : "")
				: `value="${await cfgGet(item[0])}"`;

			content.append(
				template(`<span>${item[1]}</span>`),
				template(`<input type="${item[2]}" ${val} data-cfgid="${item[0]}" />`)
			);
		}

		close.style.setProperty("--mask", `url("data:image/svg+xml;base64,${await getIcon("close")}")`);

		close.onclick = async () => {
			modalIsOpen = false;
			container.remove();

			const conf = {};

			for (const item of modalItems) {
				const elem = container.querySelector(`[data-cfgid="${item[0]}"]`);

				const isCheckbox = item[2] == "checkbox";

				if (isCheckbox || elem.value)
					conf[item[0]] = isCheckbox ? elem.checked : elem.value;
			}

			await cfgSet(conf);

			const newUrl = await getUrl();
			if (location.href.match(/.*\.com\/.+?(?=\/|$)/)[0] !== newUrl)
				location = newUrl;
		}
	}

	// END utilities

	// firefox users
	window.pearjuice = {
		config: showModal
	};

	addEventListener("load", () => {
		getCss().then(injectCss);

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
		const cmCont2 = await until(() => document.querySelector("amp-chrome-player > .right-content .account-menu > .context-menu-container"));

		for (const cmContainer of [cmCont, cmCont2]) {
			const mutObs = new MutationObserver((records) => {
				for (record of records) {
					const menu = [...record.addedNodes].find((n) => n.classList.contains("context-menu"));
					if (!menu) continue;

					const newButton = menu.firstElementChild.cloneNode(true);
					newButton.firstElementChild.textContent = "PearJuice";
					newButton.lastElementChild.replaceChildren();
					newButton.dataset.testid = "pearjuice";

					newButton.onclick = () => {
						cmContainer.firstElementChild.click()
						showModal();
					};

					menu.insertBefore(newButton, menu.lastElementChild);
				}
			});

			mutObs.observe(cmContainer, {
				childList: true,
			});
		}
	}
};
