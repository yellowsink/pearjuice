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

	addEventListener("load", () => Gluon.ipc.send("renderer ready"));

	Gluon.ipc.on("inject css", ({ css }) => {
		document.head.append(template(`<style>${css}</style>`))
	});

}