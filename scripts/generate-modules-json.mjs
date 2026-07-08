#!/usr/bin/env node
/**
 * Scan public/modules directory and generate modules.json
 * Run this before build to update the file tree
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '..', 'src', 'app', 'modules');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'app', 'modules', 'modules.json');

/** @type {string[]} */
const SUPPORTED_EXTENSIONS = ['.rad', '.imf', '.a2m', '.dro', '.cmf', '.laa', '.raw', '.a2t'];

/**
 * @typedef {Object} FileNode
 * @property {string} name
 * @property {'folder'|'file'} type
 * @property {string} path
 * @property {FileNode[]} [children]
 */

/**
 * @param {string} dirPath
 * @param {string} relativePath
 * @returns {FileNode}
 */
function scanDirectory(dirPath, relativePath = '/modules') {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  /** @type {FileNode[]} */
  const children = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const itemRelativePath = path.posix.join(relativePath, item.name);

    if (item.isDirectory()) {
      const subTree = scanDirectory(itemPath, itemRelativePath);
      if (subTree.children && subTree.children.length > 0) {
        children.push(subTree);
      }
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        children.push({
          name: item.name,
          type: 'file',
          path: itemRelativePath
        });
      }
    }
  }

  // Sort: folders first, then files, both alphabetically
  children.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    }
    return a.type === 'folder' ? -1 : 1;
  });

  return {
    name: path.basename(dirPath),
    type: 'folder',
    path: relativePath,
    children
  };
}

/**
 * @param {FileNode} node
 * @returns {number}
 */
function countFiles(node) {
  if (node.type === 'file') return 1;
  if (!node.children) return 0;
  return node.children.reduce((sum, child) => sum + countFiles(child), 0);
}

function main() {
  console.log('🔍 Scanning public/modules...');
  
  if (!fs.existsSync(MODULES_DIR)) {
    console.log('⚠️  public/modules directory does not exist, creating...');
    fs.mkdirSync(MODULES_DIR, { recursive: true });
  }

  const tree = scanDirectory(MODULES_DIR);
  
  // Check if there are any music files
  const hasFiles = tree.children && tree.children.length > 0;
  
  if (!hasFiles) {
    console.log('⚠️  No music files found in public/modules');
    console.log('   Add .rad, .imf, .a2m, .dro, .cmf, .laa, .raw, .a2t files to populate the library');
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2));
  
  const fileCount = countFiles(tree);
  console.log(`✅ Generated modules.json with ${fileCount} file(s)`);
  console.log(`   Output: ${OUTPUT_FILE}`);
}

main();
