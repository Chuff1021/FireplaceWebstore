# Model reference review — October 30, 2026

59 current supplier product pages were retrieved at controlled rates with the Aaron’s catalog user-agent. Product IDs and BCData SKUs matched the imported identities. 23 model collections contain at least two reviewed application references, with source URLs, check dates, hashes and explicit restrictions in `data/parts-model-references.json`. These are supplier application statements, not an OEM manual audit, technician diagnosis or fit guarantee. Model data does not change live stock or owner overrides.

Excluded or limited references:

- 3-30-1105-5: Current source lists Accentra-Cast; old title says Accentra FS. Alias not assumed.
- GI-93K: Current description cites GI-693K while SKU is GI-93K; replacement identity needs review.
- SRV7033-064: Current application lists 31M-ACC-AU; old title implies 3100. Alias not assumed.
- Generic 3100 and 1200i collections were withheld because titles and current model/version descriptions could not establish two unambiguous references. CB1200I is kept separate from legacy 1200i wording.
- 4300 references are limited to ACT variants, including the narrower Millennium application on 831-1970.
- Serial limits on P61/P61A/P68 and 7100FP, package counts on NZ6000 and Buck baffles, and the MA-212400 owner override remain explicit.
- Four requested source pages returned 404 and were excluded, rather than treated as empty inventory.

Source snapshots are local QA evidence under `/tmp/aarons-seo-fitment-source`; no supplier manuals or diagrams were republished. Full replacement-chain automation is not enabled: future mappings need a source reference and review.
