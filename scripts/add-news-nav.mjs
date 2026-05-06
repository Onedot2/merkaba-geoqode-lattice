import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('server.js', 'utf8');
const before = (c.match(/href="\/news">/g) || []).length;

// Pattern A: raw emoji ⚡ Products (no active class) - single line nav
c = c.split('href="/lab">Lab</a><a href="/products">⚡ Products</a>').join('href="/lab">Lab</a><a href="/news">📰 News</a><a href="/products">⚡ Products</a>');

// Pattern B: raw emoji ⚡ Products with active class - single line nav
c = c.split('href="/lab">Lab</a><a href="/products" class="active">⚡ Products</a>').join('href="/lab">Lab</a><a href="/news">📰 News</a><a href="/products" class="active">⚡ Products</a>');

// Pattern C: HTML entity &#x26A1; Products (no active class)
c = c.split('href="/lab">Lab</a><a href="/products">&#x26A1; Products</a>').join('href="/lab">Lab</a><a href="/news">&#x1F4F0; News</a><a href="/products">&#x26A1; Products</a>');

// Pattern D: HTML entity &#x26A1; Products with active class
c = c.split('href="/lab">Lab</a><a href="/products" class="active">&#x26A1; Products</a>').join('href="/lab">Lab</a><a href="/news">&#x1F4F0; News</a><a href="/products" class="active">&#x26A1; Products</a>');

// Pattern E: multiline template - "Lab</a>" then newline then "    <a href="/products" class="active">⚡ Products</a>"
c = c.split('href="/lab">Lab</a>\n    <a href="/products" class="active">⚡ Products</a>').join('href="/lab">Lab</a>\n    <a href="/news">📰 News</a>\n    <a href="/products" class="active">⚡ Products</a>');

// Pattern F: multiline template - "Lab</a>" then newline then "    <a href="/products">⚡ Products</a>"
c = c.split('href="/lab">Lab</a>\n    <a href="/products">⚡ Products</a>').join('href="/lab">Lab</a>\n    <a href="/news">📰 News</a>\n    <a href="/products">⚡ Products</a>');

const after = (c.match(/href="\/news">/g) || []).length;
writeFileSync('server.js', c);
console.log(`before: ${before}, after: ${after}, added: ${after - before}`);
