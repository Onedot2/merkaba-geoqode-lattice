// Updated to handle multiline patterns
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

// Possible indentation patterns in HTML files
const indents = ["        ", "    ", "  ", "      "];
// Possible indentation patterns in HTML files
const indents = ["        ", "    ", "  ", "      "];

for (const file of htmlFiles) {
  const path = join("public", file);
  let c = readFileSync(path, "utf8");
  const before = (c.match(/href="\/news">/g) || []).length;

  // Single-line: raw emoji ⚡
  c = c
    .split('href="/lab">Lab</a><a href="/products">⚡ Products</a>')
    .join(
      'href="/lab">Lab</a><a href="/news">📰 News</a><a href="/products">⚡ Products</a>',
    );
  c = c
    .split(
      'href="/lab">Lab</a><a href="/products" class="active">⚡ Products</a>',
    )
    .join(
      'href="/lab">Lab</a><a href="/news">📰 News</a><a href="/products" class="active">⚡ Products</a>',
    );
  // HTML entities single-line
  c = c
    .split('href="/lab">Lab</a><a href="/products">&#x26A1; Products</a>')
    .join(
      'href="/lab">Lab</a><a href="/news">&#x1F4F0; News</a><a href="/products">&#x26A1; Products</a>',
    );
  c = c
    .split(
      'href="/lab">Lab</a><a href="/products" class="active">&#x26A1; Products</a>',
    )
    .join(
      'href="/lab">Lab</a><a href="/news">&#x1F4F0; News</a><a href="/products" class="active">&#x26A1; Products</a>',
    );

  // Multiline: for each indentation level
  for (const indent of indents) {
    c = c
      .split(
        `href="/lab">Lab</a>\n${indent}<a href="/products">⚡ Products</a>`,
      )
      .join(
        `href="/lab">Lab</a>\n${indent}<a href="/news">📰 News</a>\n${indent}<a href="/products">⚡ Products</a>`,
      );
    c = c
      .split(
        `href="/lab">Lab</a>\n${indent}<a href="/products" class="active">⚡ Products</a>`,
      )
      .join(
        `href="/lab">Lab</a>\n${indent}<a href="/news">📰 News</a>\n${indent}<a href="/products" class="active">⚡ Products</a>`,
      );
    c = c
      .split(
        `href="/lab">Lab</a>\n${indent}<a href="/products">&#x26A1; Products</a>`,
      )
      .join(
        `href="/lab">Lab</a>\n${indent}<a href="/news">&#x1F4F0; News</a>\n${indent}<a href="/products">&#x26A1; Products</a>`,
      );
    c = c
      .split(
        `href="/lab">Lab</a>\n${indent}<a href="/products" class="active">&#x26A1; Products</a>`,
      )
      .join(
        `href="/lab">Lab</a>\n${indent}<a href="/news">&#x1F4F0; News</a>\n${indent}<a href="/products" class="active">&#x26A1; Products</a>`,
      );
  }

  const after = (c.match(/href="\/news">/g) || []).length;
  const added = after - before;
  writeFileSync(path, c);

  const after = (c.match(/href="\/news">/g) || []).length;
  const added = after - before;
  writeFileSync(path, c);
  if (added) console.log(`${file}: +${added}`);
  totalAdded += added;
}
console.log(`Total: +${totalAdded} news links`);
