export default () => {
	const settingsItems = [
		//["region", "Apple Music Region", "text"],
		["beta", "Opt-in to AM Beta", "checkbox"]
	]

	window.pj.getSettings = async () => {
		const content = pj.template(`<div class="pj-settings"></div>`);

		for (const item of settingsItems) {
			const val =
				item[2] === "checkbox"
					? (await pj.cfgGet(item[0]))
						? "checked"
						: ""
					: `value="${await pj.cfgGet(item[0])}"`;

			content.append(
				pj.template(`<span>${item[1]}</span>`),
				pj.template(`<input type="${item[2]}" ${val} data-cfgid="${item[0]}" />`)
			);
		}

		return [
			content,
			async () => {
				const conf = {};

				for (const item of settingsItems) {
					const elem = content.querySelector(`[data-cfgid="${item[0]}"]`);

					const isCheckbox = item[2] === "checkbox";

					if (isCheckbox || elem.value) conf[item[0]] = isCheckbox ? elem.checked : elem.value;
				}

				await pj.cfgSet(conf);
			},
		];
	};
}