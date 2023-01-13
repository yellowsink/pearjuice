// massive shoutouts to https://github.com/proprietary/chromium-widevine/

import { relative } from "./pathutils.js";
import { resolve } from "path";
import { existsSync, createReadStream } from "fs";
import { rm, mkdir, writeFile, cp } from "fs/promises";
import { platform, arch, tmpdir } from "os";
import { Extract } from "unzipper";

const tempDirectory = resolve(tmpdir(), "pearjuice");

export const getDataFolder = () =>
	relative(import.meta.url, "./gluon_data/chromium");

export const checkWidevine = () => existsSync(resolve(getDataFolder(), "WidevineCdm"));

export async function installWidevine() {
	await rm(tempDirectory, { recursive: true, force: true });
	await mkdir(tempDirectory);

	const cpuArch = arch();

	if (["x64", "ia32", "arm64"].indexOf(cpuArch) === -1) return;

	const plat =
		{
			win32: "win",
			darwin: "mac",
		}[platform()] ?? "linux";

	const versions = (
		await (await fetch("https://dl.google.com/widevine-cdm/versions.txt")).text()
	).split("\n");
	const latest = versions[versions.length - 2];

	const release = await (
		await fetch(`https://dl.google.com/widevine-cdm/${latest}-${plat}-${cpuArch}.zip`)
	).arrayBuffer();

	const wvZipPath = resolve(tempDirectory, "widevine.zip");
	const wvUnzippedPath = resolve(tempDirectory, "widevine");
	const wvFixedPath = resolve(tempDirectory, "widevine_fixed");

	await writeFile(wvZipPath, new Uint8Array(release));

	await new Promise((res) =>
		createReadStream(wvZipPath).pipe(Extract({ path: wvUnzippedPath }).on("close", res))
	);

	await mkdir(wvFixedPath);

	const files = [
		["LICENSE.txt", "LICENSE"],
		["manifest.json"],
	];

	switch (plat)
	{
		case "linux":
			files.push(["libwidevinecdm.so", `_platform_specific/linux_${cpuArch}/libwidevinecdm.so`]);
			break;
		case "mac":
			files.push(
				["libwidevinecdm.dylib", `_platform_specific/mac_${cpuArch}/libwidevinecdm.dylib`],
				["libwidevinecdm.dylib.sig", `_platform_specific/mac_${cpuArch}/libwidevinecdm.dylib.sig`]
			);
			break;
		case "win":
			files.push(
				["libwidevinecdm.dll", `_platform_specific/win_${cpuArch}/libwidevinecdm.dll`],
				["libwidevinecdm.dll.lib", `_platform_specific/win_${cpuArch}/libwidevinecdm.dll.lib`],
				["libwidevinecdm.dll.sig", `_platform_specific/win_${cpuArch}/libwidevinecdm.dll.sig`]
			);
			break;
	}

	for (const [from, to] of files)
		await cp(resolve(wvUnzippedPath, from), resolve(wvFixedPath, to ?? from), { recursive: true });

	const wvChromeLocation = resolve(getDataFolder(), `WidevineCdm/${latest}`);
	await cp(resolve(wvFixedPath), wvChromeLocation, { recursive: true });

	await writeFile(resolve(getDataFolder(), "WidevineCdm/latest-component-updated-widevine-cdm"), JSON.stringify({
		Path: wvChromeLocation
	}));

	await rm(tempDirectory, { recursive: true });

	console.log("Widevine installed successfully!");
}

export async function ensureWidevine() {
	try {
		if (checkWidevine()) return;

		await installWidevine();
	} catch (e) {
		console.error("Widevine install failed, bailing out");
		await rm(tempDirectory, { recursive: true, force: true });
		throw e;
	}
}
