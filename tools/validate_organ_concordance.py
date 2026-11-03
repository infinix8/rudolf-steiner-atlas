#!/usr/bin/env python3
"""Validate current organ evidence links, arithmetic and cumulative preservation.

Structural validation does not certify the accuracy of editorial source readings.
Run from any directory; accepts a version number (default: latest ledger).
"""
from pathlib import Path
import hashlib
from collections import Counter
import json, sys
ROOT=Path(__file__).resolve().parents[1]
version=sys.argv[1] if len(sys.argv)>1 else str(max(int(p.stem.rsplit('-v',1)[1]) for p in (ROOT/'research').glob('organ-corpus-ledger-ga313-317-v*.json')))
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
for p in (ROOT/'research').glob('organ-atomic-claims-*-v*.json'):
 if int(p.stem.rsplit('-v',1)[1])<12:continue
 d=json.loads(p.read_text());ids=set()
 for c in d['records']:
  assert c['id'] not in ids;ids.add(c['id'])
  assert c['source_url'].startswith('https://rsarchive.org/')
  assert c.get('section',c.get('paragraph'))
  for prior in c['reconciliation']['prior_claim_ids']: assert prior in claims,prior
  section_files=list((ROOT/'research').glob('organ-paragraph-review-*-v*.json')) + list((ROOT/'research').glob('organ-selected-reading-*-v*.json'))
  if c['id'].startswith('ORG-CLAIM-V') and int(c['id'].split('-')[2][1:])>=12:
   sections=[r for f in section_files for r in json.loads(f.read_text())['records']]
   assert any(r['source_url']==c['source_url'] and r['paragraph']==c['section'] for r in sections),c['id']
for d in new['dossiers']:
 for key,value in d.items():
  if key.startswith('phase') and key.endswith('_refinements') and int(key[5:].split('_')[0])>=12:
   for r in value: assert r['claim_ref_id'] in claims,r
for provenance in (ROOT/'research').glob('organ-manuscript-provenance-v*.json'):
 meta=json.loads(provenance.read_text());body=(ROOT/meta['cumulative_path']).read_bytes()
 preserved=body[meta['preserved_start_byte']:meta['preserved_end_byte_exclusive']]
 assert len(preserved)==meta['source_bytes']
 assert hashlib.sha256(preserved).hexdigest()==meta['source_sha256']
 assert hashlib.sha256(body).hexdigest()==meta['cumulative_sha256']
 if 'nested_v11' in meta:
  inner=meta['nested_v11'];v11=body[inner['preserved_start_byte']:inner['preserved_end_byte_exclusive']]
  assert len(v11)==inner['source_bytes']==185831
  assert hashlib.sha256(v11).hexdigest()==inner['source_sha256']
for e in ledger['entries']:
 if e['audit_status']=='all_numbered_english_paragraphs_reviewed' and e.get('audit_record'):
  # Prior audit files are canonical GitHub dependencies; validate locally when loaded.
  p=ROOT/e['audit_record']
  if p.exists():
   d=json.loads(p.read_text());rs=[r for r in d.get('records',[]) if r.get('catalogue_entry_id')==e['id'] or (not r.get('catalogue_entry_id') and r.get('source_url')==e['source_url'])]
   if rs and all('paragraph' in r for r in rs): assert len(rs)==e['english_paragraphs_reviewed'],e['id']
alias_path=ROOT/'research/organ-source-event-aliases-v14.json'
if alias_path.exists():
 for event in json.loads(alias_path.read_text())['events']:
  rows=event['crosswalk']
  assert [r['ga315_section'] for r in rows]==list(range(1,29))
  assert set(s for r in rows for s in r['ga313_ix_sections'])==set(range(1,25))
  assert len(event['catalogue_entries'])==len(set(event['catalogue_entries']))
print(json.dumps({'version':version,'catalogue':61,'statuses':dict(counts),'completed_English_source_view_sections':ledger['numbered_english_paragraphs_checked'],'dossiers':len(byid),'structural_checks':'passed'}))

evidence=ROOT/f'research/organ-evidence-graph-v{version}.json'
if evidence.exists():
 graph=json.loads(evidence.read_text());nodes={n['id'] for n in graph['nodes']}
 assert len(nodes)==len(graph['nodes'])
 assert all(e['source'] in nodes and e['target'] in nodes for e in graph['edges'])
