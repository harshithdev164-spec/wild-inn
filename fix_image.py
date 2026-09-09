import re
with open('src/data/destinationsData.ts', 'r') as f:
    content = f.read()

content = content.replace("imagePosition: \"object-contain bg-[#111]\",", "imagePosition: 'object-center',")
# Masinagudi is id 'masinagudi'
# We will just change masinagudi specifically
content = re.sub(r"(id: 'masinagudi',.*?imagePosition: )'object-center'", r"\1'object-[center_30%]'", content, flags=re.DOTALL)
content = re.sub(r"(id: 'kabini',.*?imagePosition: )'object-center'", r"\1'object-[center_30%]'", content, flags=re.DOTALL)

with open('src/data/destinationsData.ts', 'w') as f:
    f.write(content)
