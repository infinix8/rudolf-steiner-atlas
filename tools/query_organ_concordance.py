#!/usr/bin/env python3
"""Search current organ dossiers and selected v12+ claims, without source text copies.

Usage: python3 tools/query_organ_concordance.py liver
       python3 tools/query_organ_concordance.py --organ uterus --ga 313
Legacy dossier relations are retained; claim search scope is explicit.
"""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('query',nargs='?',default='');p.add_argument('--organ');p.add_argument('--ga',type=int);a=p.parse_args()
root=Path(__file__).resolve().parents[1]
records=[]
for file in sorted((root/'research').glob('organ-atomic-claims-*-v*.json')):
 if int(file.stem.rsplit('-v',1)[1])>=12:records.extend(json.loads(file.read_text())['records'])
matches=[c for c in records if (not a.query or a.query.casefold() in json.dumps(c,ensure_ascii=False).casefold()) and (not a.organ or any(a.organ.casefold() in x.casefold() for x in c['organs'])) and (not a.ga or c['ga']==a.ga)]
latest=max((root/'research').glob('organ-comparative-dossiers-v*.json'),key=lambda p:int(p.stem.rsplit('-v',1)[1]))
dossiers=json.loads(latest.read_text())['dossiers']
needle=a.organ or a.query
ds=[d for d in dossiers if not needle or needle.casefold() in json.dumps([d['organ'],d.get('aliases',[])],ensure_ascii=False).casefold()]
print(json.dumps({'scope':f'{len(records)} selected v12+ propositions; {len(dossiers)} cumulative dossiers. Not exhaustive corpus search; aliases not separate claims.','query':vars(a),'claim_count':len(matches),'claims':matches,'dossiers':ds},ensure_ascii=False,indent=2))
