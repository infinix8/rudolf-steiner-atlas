"""Check GA102 coverage, reconciliations and preservation of cumulative research."""
from pathlib import Path
import json,hashlib
from collections import Counter
base=Path(__file__).resolve().parents[1];r=base/'research'
def rd(n):return json.loads((r/n).read_text())
rows=rd('organ-paragraph-review-ga102-iii-xiii-v29.json')['records'];claims=rd('organ-atomic-claims-ga102-iii-xiii-v29.json')['records']
assert len(rows)==len({(x['lecture'],x['paragraph']) for x in rows})==280
assert len(claims)==len({x['id'] for x in claims})==87
ledger=rd('organ-corpus-ledger-ga102-v29.json')
assert len(ledger['entries'])==ledger['complete_English_source_views']==13
assert ledger['unread']==0 and ledger['numbered_units_reviewed']==336 and ledger['unnumbered_prose_blocks_reviewed']==4
for e in ledger['entries']:
 rr=[x for x in rd(Path(e['audit_record']).name)['records'] if x['catalogue_entry_id']==e['id']]
 assert [x['paragraph'] for x in rr if isinstance(x['paragraph'],int)]==list(range(1,e['english_paragraphs_reviewed']+1))
refs=set()
for p in r.glob('organ-atomic-claims-*.json'):
 refs.update(x['id'] for x in json.loads(p.read_text()).get('records',[]))
for c in claims:
 row=next(x for x in rows if x['lecture']==c['lecture'] and x['paragraph']==c['section'])
 assert row['source_url']==c['source_url'] and row['speaker']=='Steiner'
 assert c['id'] in row['claim_ids'] and set(c['reconciliation']['prior_claim_ids'])<=refs
assert Counter(c['id'] for c in claims)==Counter(i for x in rows for i in x['claim_ids'])
old={x['id']:x for x in rd('organ-comparative-dossiers-v28.json')['dossiers']}
new=rd('organ-comparative-dossiers-v29.json')['dossiers']
assert len(new)==40
for x in new:
 assert all(x[k]==v for k,v in old[x['id']].items())
 assert all(y['claim_ref_id'] in refs for y in x.get('phase29_refinements',[]))
m=rd('organ-manuscript-provenance-v29.json');b=(base/m['cumulative_path']).read_bytes();s=b[m['preserved_start_byte']:m['preserved_end_byte_exclusive']]
assert len(s)==m['source_bytes'] and hashlib.sha256(s).hexdigest()==m['source_sha256']
assert hashlib.sha256(b).hexdigest()==m['cumulative_sha256']
assert len(rd('organ-german-checks-and-textual-issues-v29.json')['checks'])==18
print('PASS: GA102 13 complete English views, 336 numbered positions, 4 additional blocks; 87 reconciled selected records, 40 preserved dossiers, 18 German checks, cumulative manuscript hash')
