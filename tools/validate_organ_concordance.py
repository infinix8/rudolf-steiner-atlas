#!/usr/bin/env python3
"""Validate current organ evidence links, arithmetic and cumulative preservation.

Structural validation does not certify the accuracy of editorial source readings.
Run from any directory; accepts a version number (default 12).
"""
from pathlib import Path
from collections import Counter
import json, sys
ROOT=Path(__file__).resolve().parents[1]
version=sys.argv[1] if len(sys.argv)>1 else '12'
def load(path):return json.loads((ROOT/path).read_text())
ledger=load(f'research/organ-corpus-ledger-ga313-317-v{version}.json')
counts=Counter(x['audit_status'] for x in ledger['entries'])
assert len(ledger['entries'])==ledger['catalogued_entries']==61
assert len({x['id'] for x in ledger['entries']})==61
assert counts['unreviewed']==ledger['unreviewed']
complete=counts['all_numbered_english_paragraphs_reviewed']
assert complete==ledger['english_paragraph_coverage_complete']==ledger['english_paragraph_coverage_completed']
assert ledger['selective_passage_reviews']==counts['selected_english_passages_checked_not_whole_lecture']
assert ledger['partially_reviewed']==61-complete-counts['unreviewed']
assert ledger['fully_audited']==0
assert sum(x.get('english_paragraphs_reviewed',0) for x in ledger['entries'] if x['audit_status']=='all_numbered_english_paragraphs_reviewed')==ledger['numbered_english_paragraphs_checked']
census=load('research/organ-section-census-ga313-ga317-v12.json')
assert len(census['sections'])==164
assert len({x['id'] for x in census['sections']})==164
assert census['number_located_only']==0
assert all('whole_numbered_english_section_reviewed' in x['review_state'] for x in census['sections'])
old=load('research/organ-comparative-dossiers-v11.json')
new=load(f'research/organ-comparative-dossiers-v{version}.json')
assert len(new['dossiers'])==new['dossier_count']
byid={x['id']:x for x in new['dossiers']}
for d in old['dossiers']:
 assert byid[d['id']]['relations']==d['relations'],d['id']+' lost prior relations'
claims={}
for p in (ROOT/'research').glob('organ-*.json'):
 d=json.loads(p.read_text())
 for r in d.get('records',[]):
  if r.get('id'): claims[r['id']]=r
for p in (ROOT/'research').glob('organ-atomic-claims-*-v1[23].json'):
 d=json.loads(p.read_text());ids=set()
 for c in d['records']:
  assert c['id'] not in ids;ids.add(c['id'])
  assert c['source_url'].startswith('https://rsarchive.org/')
  assert c.get('section',c.get('paragraph'))
  for prior in c['reconciliation']['prior_claim_ids']: assert prior in claims,prior
for d in new['dossiers']:
 for key,value in d.items():
  if key.startswith('phase12_refinements') or key.startswith('phase13_refinements'):
   for r in value: assert r['claim_ref_id'] in claims,r
for e in ledger['entries']:
 if e['audit_status']=='all_numbered_english_paragraphs_reviewed' and e.get('audit_record'):
  # Prior audit files are canonical GitHub dependencies; validate locally when loaded.
  p=ROOT/e['audit_record']
  if p.exists():
   d=json.loads(p.read_text());rs=[r for r in d.get('records',[]) if r.get('ga')==e['ga'] and r.get('date')==e['date']]
   if rs and all('paragraph' in r for r in rs): assert len(rs)==e['english_paragraphs_reviewed'],e['id']
print(json.dumps({'version':version,'catalogue':61,'statuses':dict(counts),'completed_English_sections':ledger['numbered_english_paragraphs_checked'],'dossiers':len(byid),'structural_checks':'passed'}))
