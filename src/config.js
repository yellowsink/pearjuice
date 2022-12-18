import { existsSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import { platform, homedir } from "os";
import { resolve } from "path";

const cfgPath = resolve(
	homedir(),
	{
		darwin: "Library/pearjuice.json",
		win32: "AppData/Roaming/pearjuice.json",
	}[platform()] ?? ".config/pearjuice.json"
);

const config = {
	region: "us",
	beta: false,
};

export async function load() {
	if (existsSync(cfgPath))
		Object.assign(config, JSON.parse((await readFile(cfgPath)).toString()));
}

const save = () => writeFile(cfgPath, JSON.stringify(config));

export const get = k => config[k];

export async function set(k, v) {
	config[k] = v;
	await save();
}