import re
with open("src/pages/TourDetail.tsx", "r") as f:
    content = f.read()

content = re.sub(r'transition-colors \n\s*<ArrowLeft', 'transition-colors">\n            <ArrowLeft', content)
content = re.sub(r'mb-4 \n\s*\{destination\.name\}', 'mb-4">\n            {destination.name}', content)
content = re.sub(r'uppercase \n\s*<div className="flex items-center gap-1\.5">', 'uppercase">\n            <div className="flex items-center gap-1.5">', content)

with open("src/pages/TourDetail.tsx", "w") as f:
    f.write(content)
