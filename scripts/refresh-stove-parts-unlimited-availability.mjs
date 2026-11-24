#!/usr/bin/env node
// Stock updates now use HearthOS's durable database queue. Never rewrite bundled
// JSON stock snapshots: a partial fetch must not overwrite verified inventory.
console.error('The JSON refresh has been retired. Run HearthOS scripts/parts-observe.ts for a read-only check, or the authenticated /api/cron/parts-scan worker for database updates. See HearthOS docs/PARTS_COMMERCE.md.');
process.exitCode = 1;
