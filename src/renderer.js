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



	addEventListener("load", () => {
		Gluon.ipc.send("get css").then(injectCss);
	});

}