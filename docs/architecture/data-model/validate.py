#!/usr/bin/env python3
"""Offline structural/relationship validation of the CAZ WordPress V1 data blueprint.
Requires: pip install jsonschema
This does NOT interact with a live WordPress installation or MySQL database.
"""
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

BASE = Path(__file__).resolve().parent
TYPES = ('brands','categories','regions','legal_entities','products','branches')


def validate_document(doc: dict, schema: dict) -> list[str]:
    errors = []
    v = Draft202012Validator(schema, format_checker=FormatChecker())
    for error in sorted(v.iter_errors(doc), key=lambda e: str(list(e.absolute_path))):
        path = '.'.join(map(str, error.absolute_path)) or 'root'
        errors.append(f'{path}: {error.message}')
    # Continue with cross-reference checks for these well-shaped test fixtures,
    # even when some values violate JSON Schema constraints.

    ids = {}
    for typ in TYPES:
        slugs = set()
        for record in doc[typ]:
            uid = record['public_id']
            if uid in ids:
                errors.append(f'{typ}: duplicate public_id {uid} also found in {ids[uid]}')
            ids[uid] = typ
            if record['slug'] in slugs:
                errors.append(f'{typ}: duplicate slug {record["slug"]}')
            slugs.add(record['slug'])

    ref_sets = {typ: {entry['public_id'] for entry in doc[typ]} for typ in TYPES}
    def check(target_type, value, path):
        if value is not None and value not in ref_sets[target_type]:
            errors.append(f'{path}: references unknown {target_type} ID {value}')

    parent_map = {}
    for i,c in enumerate(doc['categories']):
        parent_map[c['public_id']] = c['parent_category_ref']
        check('categories', c['parent_category_ref'], f'categories.{i}.parent_category_ref')
    for uid in parent_map:
        visited=set()
        current=uid
        while current is not None and current in parent_map:
            if current in visited:
                errors.append(f'categories: cycle detected starting at {uid}')
                break
            visited.add(current)
            current=parent_map[current]

    for i,p in enumerate(doc['products']):
        check('brands',p['brand_ref'],f'products.{i}.brand_ref')
        for j,uid in enumerate(p['category_refs']):
            check('categories',uid,f'products.{i}.category_refs.{j}')

    for i,b in enumerate(doc['branches']):
        check('regions',b['region_ref'],f'branches.{i}.region_ref')
        check('legal_entities',b['operating_entity_ref'],f'branches.{i}.operating_entity_ref')
        check('legal_entities',b['fiscal_entity_ref'],f'branches.{i}.fiscal_entity_ref')
        if (b.get('latitude') is None) != (b.get('longitude') is None):
            errors.append(f'branches.{i}: latitude and longitude must be provided together')
    return errors


def main():
    schema=json.loads((BASE/'content-model.schema.json').read_text(encoding='utf-8'))
    valid=json.loads((BASE/'sample-valid.json').read_text(encoding='utf-8'))
    invalid=json.loads((BASE/'sample-invalid.json').read_text(encoding='utf-8'))
    good_errors=validate_document(valid,schema)
    bad_errors=validate_document(invalid,schema)
    print(f'Positive test: {"PASS" if not good_errors else "FAIL"} ({len(good_errors)} errors)')
    if good_errors: print('\n'.join('  '+e for e in good_errors))
    print(f'Negative test: {"PASS (rejected as intended)" if len(bad_errors)>=3 else "FAIL"} ({len(bad_errors)} errors)')
    for e in bad_errors: print('  - '+e)
    if good_errors or len(bad_errors)<3:
        raise SystemExit(1)
    report='''# Step 5 — Offline validation report

**Result:** PASS for the valid sample; PASS for the intentionally invalid sample (rejected).

**Test scope:** JSON Schema type/required fields, publication rules, price/availability visibility, uniqueness of IDs/slugs, relationship integrity, category hierarchy cycles, and branch coordinate pairing.

**Valid sample:** {summary}.

**Negative tests:** {count} problems detected as expected:
{detail}

**Important limits:** These checks only validate our *conceptual content model* and illustrative fixture records. They do **not** verify a live WordPress setup, custom field registration, media permissions, WordPress REST endpoints, real product stock, real branch addresses, or a Laravel migration. Those remain integration tests for the future WordPress implementation.
'''.format(summary=', '.join(f'{len(valid[t])} {t}' for t in TYPES), count=len(bad_errors), detail='\n'.join('- '+e for e in bad_errors))
    (BASE/'validation-report.md').write_text(report,encoding='utf-8')

if __name__=='__main__':main()
