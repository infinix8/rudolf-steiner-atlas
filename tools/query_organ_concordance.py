#!/usr/bin/env python3
"""Search current organ dossiers and checked v12–v13 claims, without source text copies.

Usage: python3 tools/query_organ_concordance.py liver
       python3 tools/query_organ_concordance.py --organ uterus --ga 313
Legacy dossier relations are retained; claim search scope is explicit.
"""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('query',nargs='?',default='');p.add_argument('--organ');p.add_argument('--ga',type=int);a=p.parse_args()
root=Path(__file__).resolve().parents[1]
records=[]
for name in ['organ-atomic-claims-ga317-iii-iv-v12.json','organ-atomic-claims-ga313-iv-vi-ga317-v-v13.json']:
 records.extend(json.loads((root/'research'/name).read_text())['records'])
matches=[c for c in records if (not a.query or a.query.casefold() in json.dumps(c,ensure_ascii=False).casefold()) and (not a.organ or any(a.organ.casefold() in x.casefold() for x in c['organs'])) and (not a.ga or c['ga']==a.ga)]
dossiers=json.loads((root/'research/organ-comparative-dossiers-v13.json').read_text())['dossiers']
needle=a.organ or a.query
ds=[d for d in dossiers if not needle or needle.casefold() in json.dumps([d['organ'],d.get('aliases',[])],ensure_ascii=False).casefold()]
print(json.dumps({'scope':'93 selected v12–v13 propositions; 21 cumulative dossiers. Not exhaustive corpus search.','query':vars(a),'claim_count':len(matches),'claims':matches,'dossiers':ds},ensure_ascii=False,indent=2))
