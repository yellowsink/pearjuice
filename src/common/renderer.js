export default () => {
	debugger
	window.pj ??= {};

	Object.assign(pj, {
		// this function does not sanitize scripts. be careful.
		// it also only returns one element, not multiple.
		template(str) {
			const parent = document.createElement("_");
			parent.innerHTML = str;
			const child = parent.firstElementChild;
			parent.replaceChildren();

			return child;
		},

		injectCss: css => document.head.append(pj.template(`<style>${css}</style>`)),

		cfgGet: async (k) => Gluon.ipc.send("config get", k),
		cfgSet: async (o) => Gluon.ipc.send("config set", o),
		getCss: async () => Gluon.ipc.send("get css"),
		getUrl: async () => Gluon.ipc.send("get url"),
		getIcon: async (i) => Gluon.ipc.send("get icon", i),

		async until(condition) {
			while (!(await condition())) {
				// noinspection JSCheckFunctionSignatures
				await new Promise(setTimeout);
			}
			return condition();
		}
	});

	addEventListener("load", () => pj.getCss().then(pj.injectCss));
}