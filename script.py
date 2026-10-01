
import httpx
import re

html = httpx.get('https://listextinctanimals-online-1.onrender.com/pt-br/').text
print('Hero:', re.findall(r'<section[^>]*class="([^"]+)"', html))
print('Grid:', re.findall(r'<ul[^>]*class="([^"]*grid[^"]*)"', html))
print('Card:', re.findall(r'<li[^>]*class="([^"]+)"', html)[:1])
print('Classes directly:', re.findall(r'class="([^"]+)"', html)[:20])

