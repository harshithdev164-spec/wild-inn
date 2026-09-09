with open("src/pages/TourDetail.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """<Link to="/experiences" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-mono tracking-widest uppercase mb-8 transition-colors             <ArrowLeft className="w-4 h-4" />""",
    """<Link to="/experiences" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-mono tracking-widest uppercase mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />"""
)

content = content.replace(
    """<h1 className="text-5xl sm:text-7xl lg:text-8xl font-sans font-normal tracking-tight text-white mb-4             {destination.name}""",
    """<h1 className="text-5xl sm:text-7xl lg:text-8xl font-sans font-normal tracking-tight text-white mb-4">
            {destination.name}"""
)

content = content.replace(
    """<div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-mono tracking-wider uppercase             <div className="flex items-center gap-1.5">""",
    """<div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-mono tracking-wider uppercase">
            <div className="flex items-center gap-1.5">"""
)

with open("src/pages/TourDetail.tsx", "w") as f:
    f.write(content)
