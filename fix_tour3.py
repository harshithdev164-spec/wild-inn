import re
with open("src/pages/TourDetail.tsx", "r") as f:
    content = f.read()

content = re.sub(r'transition-colors \s*<ArrowLeft', 'transition-colors">\n            <ArrowLeft', content)
content = re.sub(r'mb-4 \s*\{destination\.name\}', 'mb-4">\n            {destination.name}', content)
content = re.sub(r'uppercase \s*<span className="flex items-center gap-2"><MapPin', 'uppercase">\n            <span className="flex items-center gap-2"><MapPin', content)

with open("src/pages/TourDetail.tsx", "w") as f:
    f.write(content)
