import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const INDENT = '        '; // 8 spaces
const files = readdirSync('public').filter(f => f.endsWith('.html'));
let total = 0;

for (const file of files) {
  const path = join('public', file);
  let c = readFileSync(path, 'utf8');
  const before = (c.match(/href="\/news">/g) || []).length;
  
  const OLD_PLAIN = `href="/lab">Lab</a>\n${INDENT}<a href="/products">⚡ Products</a>`;
  const NEW_PLAIN = `href="/lab">Lab</a>\n${INDENT}<a href="/news">📰 News</a>\n${INDENT}<a href="/products">⚡ Products</a>`;
  const OLD_ACTIVE = `href="/lab">Lab</a>\n${INDENT}<a href="/products" class="active">⚡ Products</a>`;
  const NEW_ACTIVE = `href="/lab">Lab</a>\n${INDENT}<a href="/news">📰 News</a>\n${INDENT}<a href="/products" class="active">⚡ Products</a>`;

  const idx1 = c.indexOf(OLD_PLAIN);
  const idx2 = c.indexOf(OLD_ACTIVE);
  console.log(`${file}: plain_idx=${idx1}, active_idx=${idx2}`);
  
  c = c.split(OLD_PLAIN).join(NEW_PLAIN);
  c = c.split(OLD_ACTIVE).join(NEW_ACTIVE);
  
  const after = (c.match(/href="\/news">/g) || []).length;
  writeFileSync(path, c);
  total += after - before;
  if (after - before) console.log(`  -> added ${after - before}`);
}
console.log(`Total: +${total}`);
