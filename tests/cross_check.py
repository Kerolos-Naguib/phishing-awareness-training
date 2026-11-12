import re, zipfile, json, sys, glob
from pathlib import Path
from pptx import Presentation
# Cross-deliverable consistency checks. Run from anywhere:  python3 tests/cross_check.py   (needs python-pptx)
ROOT=Path(__file__).resolve().parent.parent
pptx=str(ROOT/"presentation"/"Phishing_Awareness_Training_EN.pptx"); html=open(ROOT/"web-module"/"index.html",encoding="utf8").read()
src=str(ROOT/"web-module"/"source"/"src"); out=[]
def rec(name, ok, detail): out.append((name, "PASS" if ok else "FAIL", detail)); print(("PASS" if ok else "FAIL"), name, "-", detail)

# 1 palette parity
z=zipfile.ZipFile(pptx); th=z.read("ppt/theme/theme1.xml").decode()
deck=set(m.upper() for m in re.findall(r'srgbClr val="([0-9A-Fa-f]{6})"',th))
css=open(src+"/styles.css").read().upper()
core={"101820":"Deep Navy","1B2838":"Slate Navy","3B82A0":"Muted Blue","75A9B8":"Soft Cyan","E6EAF0":"Off White","C65D63":"Muted Red"}
miss_d=[k for k in core if k not in deck]; miss_h=[k for k in core if "#"+k not in css]
rec("Palette: 6 core colors in deck theme and HTML CSS", not miss_d and not miss_h, f"missing in deck={miss_d} html={miss_h}")
# 2 fonts
fonts=set(re.findall(r'<a:latin typeface="([^"]+)"',th)); first=re.search(r'--sans:([^;]+);',open(src+"/styles.css").read()).group(1).split(",")[0].strip('"')
rec("Typography: deck theme font equals first HTML font", fonts=={"Calibri"} and first=="Calibri", f"deck={fonts} html-first={first}")
# 3 quiz parity
prs=Presentation(pptx); dq=[]
for i in range(12,17):
    s=prs.slides[i]; texts=[sh.text_frame.text for sh in s.shapes if sh.has_text_frame]
    q=[t for t in texts if t.endswith("?") and len(t)>30][0]
    letters=[("A","B","C","D").index(texts[j]) for j in []]
    opts=[]; 
    # options: text boxes following letter circles; collect in shape order those not letter/answer/eyebrow
    cand=[t for t in texts if t not in ("A","B","C","D") and t!=q and not t.startswith("QUIZ") and not t.startswith("Code Alpha") and not t.startswith("Answer:") and not t.startswith("Quiz ") and not t.isdigit() and not (len(t)<3)]
    ans=[t for t in texts if t.startswith("Answer:")]
    dq.append((q,[c for c in cand if c!=q][:4],ans[0].split("\n")[0].replace("Answer: ","") if ans else None, i+1))
qts=open(src+"/data/quiz.ts",encoding="utf8").read()
blocks=re.findall(r'\{ id: "q\d", q: l\("((?:[^"\\]|\\.)*)", "(?:[^"\\]|\\.)*"\),\s*opts: \[(.*?)\], correct: (\d)',qts,re.S)
ok=True; det=[]
for (hq,ho,hc),(q,opts,ans,sl) in zip(blocks,dq):
    ho=[x.replace("\\'","'").replace('\\"','"') for x in re.findall(r'l\("((?:[^"\\]|\\.)*)", "(?:[^"\\]|\\.)*"\)',ho)]
    hq=hq.replace("\\'","'").replace('\\"','"')
    good=(hq==q) and (ho==opts) and ("ABCD"[int(hc)]==ans)
    if not good: ok=False; det.append(f"slide{sl}: q={hq==q} opts={ho==opts} ans={'ABCD'[int(hc)]}/{ans}")
rec("Quiz parity: 5 questions, options and correct answers identical in deck and HTML", ok and len(blocks)==5==len(dq), "; ".join(det) or "5/5 identical")
# 4 notes
bad=[]; 
for i,s in enumerate(prs.slides,1):
    n=s.notes_slide.notes_text_frame.text if s.has_notes_slide else ""
    ar=len(re.findall(r'[\u0600-\u06FF]',n)); la=len(re.findall(r'[A-Za-z]',n))
    if len(n)<300 or ar<len(n)*0.5: bad.append(f"{i}:len{len(n)} ar{ar}")
rec("Arabic speaker notes: all 18 slides present, >=300 chars, mostly Arabic", len(prs.slides)==18 and not bad, "bad="+str(bad) if bad else "18/18 complete")
# 5 placeholders
pat=re.compile(r'lorem|ipsum|\bTODO\b|\bTBD\b|FIXME|\bXXX\b|placeholder|click to (add|edit)|\[insert|your text here',re.I)
hits=[]
for i,s in enumerate(prs.slides,1):
    txt=" ".join(sh.text_frame.text for sh in s.shapes if sh.has_text_frame)+" "+(s.notes_slide.notes_text_frame.text if s.has_notes_slide else "")
    alt=" ".join((sh._element.xpath('.//p:cNvPr/@descr') or [""])[0] for sh in s.shapes)
    for m in pat.finditer(txt+alt): hits.append(f"deck{i}:{m.group(0)}")
    for sh in s.placeholders:
        if sh.has_text_frame and not sh.text_frame.text.strip(): hits.append(f"deck{i}:empty placeholder")
for f in glob.glob(src+"/**/*.ts*",recursive=True)+glob.glob(src+"/*.css"):
    for m in pat.finditer(open(f,encoding="utf8").read()): hits.append(f.split("/src/")[1]+":"+m.group(0))
rec("No placeholder text (deck text, notes, alt text, HTML source)", not hits, str(hits) if hits else "none found")
# 6 hyperlinks parity
deck_links=set()
for s in prs.slides:
    for sh in s.shapes:
        if sh.has_text_frame:
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if r.hyperlink.address: deck_links.add(r.hyperlink.address)
refs=open(src+"/data/references.ts",encoding="utf8").read(); html_links=set(re.findall(r'url: "(https://[^"]+)"',refs))
rec("Reference lists identical (deck hyperlinks vs HTML references)", deck_links==html_links and len(deck_links)==11, f"deck={len(deck_links)} html={len(html_links)} only_deck={sorted(deck_links-html_links)} only_html={sorted(html_links-deck_links)}")

# 7 stats parity
alltxt=" ".join(sh.text_frame.text for s in prs.slides for sh in s.shapes if sh.has_text_frame)
notes=" ".join(s.notes_slide.notes_text_frame.text for s in prs.slides)
srcall=" ".join(open(f,encoding="utf8").read() for f in glob.glob(src+"/**/*.ts*",recursive=True))
miss=[]
for k in ["84%","13%","$120","60 months"]:
    if k not in alltxt: miss.append("deck:"+k)
    if k not in srcall and k!="$120": miss.append("html:"+k)
rec("Key statistics present in both (84%, 13%, $120M, 60 months)", not miss and "$120 million" in srcall, str(miss) if miss else "consistent")
# 8 old/unsupported wording gone
old=["fell victim","not to all employees","similar to Quanta","name similar","Press reports identified","victims, not"]
found=[o for o in old if o in alltxt or o in srcall or o in notes]
rec("Corrected claims: no unsupported wording remains", not found, str(found) if found else "none")
# 9 domains
doms=set(m.lower() for m in re.findall(r'\b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:com|org|net|example|test|invalid)\b',alltxt))
REAL={'apwg.org','cyberscoop.com','www.biometricupdate.com'}  # real reporting address / cited sources, not example domains
badd=[d for d in doms if not d.endswith((".test",".invalid")) and d not in REAL]
rec("Deck example domains use only .test/.invalid (real reporting/source names excluded)", not badd, f"example domains={sorted(d for d in doms if d.endswith((chr(46)+'test',chr(46)+'invalid')))} unexpected={badd}")
(ROOT/"tests"/"test-results").mkdir(parents=True,exist_ok=True)
json.dump({"summary":{"total":len(out),"passed":sum(1 for o in out if o[1]=="PASS"),"failed":sum(1 for o in out if o[1]=="FAIL")},"results":[{"check":a,"status":b,"detail":c} for a,b,c in out]},open(ROOT/"tests"/"test-results"/"cross-check-results.json","w"),ensure_ascii=False,indent=1)
