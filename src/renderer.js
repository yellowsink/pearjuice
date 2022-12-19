export default async () => {
	window.pj ??= {};

	let modalIsOpen = false;

	pj.config = async function() {
		if (modalIsOpen) return;

		const container = pj.template(`
<div class="pj-modal-root">
	<div class="pj-modal">
		<div class="pj-modal-header">
			<button class="pj-modal-close"></button>
			PearJuice settings
		</div>
	</div>
</div>
`);

		modalIsOpen = true;
		document.body.append(container);

		const [settings, flushSettings] = await pj.getSettings();

		container.getElementsByClassName("pj-modal")[0].append(settings);

		const close = container.getElementsByClassName("pj-modal-close")[0];


		close.style.setProperty("--mask", `url("${await pj.getIcon("close")}")`);

		close.onclick = async () => {
			modalIsOpen = false;
			container.remove();

			await flushSettings();

			const newUrl = await pj.getUrl();
			if (location.href.match(/.*\.com\/.+?(?=\/|$)/)[0] !== newUrl)
				location = newUrl;
		}
	}

	// END utilities

	addEventListener("load", async () => {
		await Promise.all([
			autoSignIn(),
			accountContextMenu(),
			autoRegion(),
		]);
	});

	// START tweaks

	async function autoSignIn() {
		await pj.until(() => document.querySelector("amp-lcd"));
		const mkInstance = await pj.until(() => MusicKit.getInstance());

		if (!mkInstance.isAuthorized) {
			const btn = await pj.until(() => document.querySelector("amp-lcd .auth-content > button"));
			btn.click();
		}
	}

	async function accountContextMenu() {
		const cmCont = await pj.until(() => document.querySelector("amp-lcd .account-menu > .context-menu-container"));
		const cmCont2 = await pj.until(() => document.querySelector("amp-chrome-player > .right-content .account-menu > .context-menu-container"));

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
						window.pj.config();
					};

					menu.insertBefore(newButton, menu.lastElementChild);
				}
			});

			mutObs.observe(cmContainer, {
				childList: true,
			});
		}
	}

	async function autoRegion() {
		const mkInstance = await pj.until(() => MusicKit.getInstance());

		await pj.until(() => mkInstance.me());

		const accountInfo = await mkInstance.me();

		if (accountInfo.subscription.storefront !== await pj.cfgGet("region")) {
			await pj.cfgSet({region: accountInfo.subscription.storefront});
			location = await pj.getUrl();
		}
	}
};
