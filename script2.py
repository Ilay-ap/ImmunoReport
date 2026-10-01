
import httpx
import re
html = httpx.get('https://listextinctanimals-online-1.onrender.com/pt-br/').text
match = re.search(r'(<ul[^>]*id=.animal-list.[^>]*>.*?</ul>)', html, re.S)
if match:
    print(match.group(1)[:1000])
else:
    match2 = re.search(r'(<article[^>]*class=.animal-card.[^>]*>.*?</article>)', html, re.S)
    if match2:
        print(match2.group(1)[:1000])

