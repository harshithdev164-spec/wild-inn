import re
with open("src/data/destinationsData.ts", "r") as f:
    content = f.read()

content = re.sub(r"(id: 'masinagudi',.*?imagePosition: )'object-\[center_20%\]'", r"\1'object-[center_10%]'", content, flags=re.DOTALL)
content = re.sub(r"(id: 'kabini',.*?imagePosition: )'object-\[center_20%\]'", r"\1'object-[center_30%]'", content, flags=re.DOTALL) # Kabini is pretty good at 30% or 20%, maybe let's use 20% for Kabini

with open("src/data/destinationsData.ts", "w") as f:
    f.write(content)
