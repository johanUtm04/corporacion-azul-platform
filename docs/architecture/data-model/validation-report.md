# Step 5 — Offline validation report

**Result:** PASS for the valid sample; PASS for the intentionally invalid sample (rejected).

**Test scope:** JSON Schema type/required fields, publication rules, price/availability visibility, uniqueness of IDs/slugs, relationship integrity, category hierarchy cycles, and branch coordinate pairing.

**Valid sample:** 2 brands, 4 categories, 1 regions, 1 legal_entities, 2 products, 1 branches.

**Negative tests:** 3 problems detected as expected:
- branches.0.address: None is not of type 'string'
- products.0.price_amount: None is not of type 'number'
- branches.0.region_ref: references unknown regions ID 891b9e6f-4b81-5b65-babb-f2ab7c693388

**Important limits:** These checks only validate our *conceptual content model* and illustrative fixture records. They do **not** verify a live WordPress setup, custom field registration, media permissions, WordPress REST endpoints, real product stock, real branch addresses, or a Laravel migration. Those remain integration tests for the future WordPress implementation.
