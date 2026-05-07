const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Get the plugin directory path
const pluginDir = __dirname;
const parentDir = path.dirname(pluginDir);

// Read version from plugin-main.php
const phpContent = fs.readFileSync(path.join(pluginDir, 'plugin-main.php'), 'utf8');
const versionMatch = phpContent.match(/Version:\s*(.+)/);
const version = versionMatch ? versionMatch[1].trim() : 'unknown';

console.log(`Building zip for version: ${version}`);

// Files/directories to exclude
const excludes = [
	'node_modules',
	'.git',
	'src',
	'.babelrc',
	'.distignore',
	'.eslintignore',
	'.eslintrc.js',
	'.gitignore',
	'.prettierignore',
	'.prettierrc.js',
	'.stylelintignore',
	'.stylelintrc',
	'jsconfig.json',
	'package-lock.json',
	'package.json',
	'webpack.config.js',
	'dist',
	'build-zip.js',
	'CLAUDE.md',
	'.claude'
];

// Create output stream with "v" prefix in version
const zipFileName = `easy-accordion-free-v${version}.zip`;
const zipPath = path.join(parentDir, zipFileName);
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
	console.log(`✓ Zip file created: ${zipPath}`);
	console.log(`  File size: ${archive.pointer()} bytes`);
});

archive.on('error', (err) => {
	throw err;
});

archive.pipe(output);

// Add files to zip with the folder name 'easy-accordion-free' (without version)
const entries = fs.readdirSync(pluginDir, { withFileTypes: true });

for (const entry of entries) {
	if (excludes.includes(entry.name)) {
		continue;
	}

	const fullPath = path.join(pluginDir, entry.name);

	if (entry.isDirectory()) {
		archive.directory(fullPath, `easy-accordion-free/${entry.name}`);
	} else if (entry.isFile()) {
		archive.file(fullPath, { name: `easy-accordion-free/${entry.name}` });
	}
}

archive.finalize();
