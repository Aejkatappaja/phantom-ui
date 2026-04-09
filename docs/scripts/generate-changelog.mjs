#!/usr/bin/env node

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "src/content/docs/changelog.md");
const repo = "Aejkatappaja/phantom-ui";

function run(cmd) {
	return execSync(cmd, { cwd: join(root, ".."), encoding: "utf8" }).trim();
}

const tags = JSON.parse(
	run(`gh release list --repo ${repo} --limit 50 --json tagName,publishedAt`)
);
tags.sort((a, b) => b.tagName.localeCompare(a.tagName, undefined, { numeric: true }));

let md = `---
title: Changelog
description: Release history for phantom-ui
---

`;

for (let i = 0; i < tags.length; i++) {
	const { tagName, publishedAt } = tags[i];
	const version = tagName.replace(/^v/, "");
	const date = publishedAt.slice(0, 10);
	const body = run(`gh release view ${tagName} --repo ${repo} --json body -q .body`);
	const latest = i === 0 ? ' <span style="display:inline-block;vertical-align:middle;font-size:0.4em;font-weight:600;letter-spacing:0.05em;padding:4px 10px;border-radius:100px;background:rgba(158,206,106,0.15);color:#9ece6a;margin-left:8px;position:relative;top:-2px">latest</span>' : "";

	md += `## ${version}${latest}\n\n`;
	md += `*${date}*\n\n`;

	if (body) {
		md += `${body}\n\n`;
	}
}

writeFileSync(outPath, md);
console.log(`changelog: generated ${outPath} (${tags.length} releases)`);
