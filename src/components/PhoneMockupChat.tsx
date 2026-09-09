import { motion } from 'motion/react';
import { Check, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import founderUrl from '../assets/founder.webp';

export default function PhoneMockupChat() {
  const chatMessages = [
    {
      sender: 'guide',
      text: "Good morning! Ready for tomorrow's desert adventure? 🏜️",
      time: '09:05 AM',
    },
    {
      sender: 'user',
      text: "Almost ready! What should I bring with me? 👌",
      time: '09:07 AM',
    },
    {
      sender: 'guide',
      text: 'Just water, a hat, and light clothes - mornings are cool, afternoons warm :)',
      time: '09:08 AM',
    },
  ];

  const tips = [
    { title: 'Light clothes', desc: 'Cool mornings, warm afternoons' },
    { title: 'Sun protection', desc: 'Bring water, hat, and sunscreen' },
    { title: 'Private transport', desc: 'Private pick-up on request' },
  ];

  return (
    <div id="phone-mockup-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      {/* Visual iPhone Mockup Column (Left on desktop) */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative w-full max-w-[310px] aspect-[9/18.5] bg-[#161513] rounded-[48px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-white/5">
          {/* Speaker & Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] ml-auto mr-4" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative w-full h-full bg-[#FAF7F2] rounded-[38px] overflow-hidden flex flex-col pt-8 pb-4">
            
            {/* Status Bar */}
            <div className="px-5 py-1.5 flex justify-between items-center text-[10px] font-semibold text-charcoal/70 font-mono">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5">
                <span>5G</span>
                <div className="w-5 h-2.5 border border-charcoal/35 rounded-sm p-0.5 flex items-center">
                  <div className="w-full h-full bg-charcoal rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Chat Header */}
            <div className="px-4 py-3 bg-white border-b border-warm-gray/10 flex items-center space-x-3 shadow-2xs">
              <div className="relative">
                <img
                  src={founderUrl}
                  alt="Lead Guide"
                  loading="lazy"
                  className="w-9 h-9 rounded-full object-cover border border-terracotta/20"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <span className="block text-xs font-serif font-bold text-charcoal">Nagadharshan (Wild Inn)</span>
                <span className="block text-[9px] font-mono text-warm-gray">Founder</span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-sand/40">
              {chatMessages.map((msg, index) => {
                const isGuide = msg.sender === 'guide';
                return (
                  <motion.div
                    id={`chat-bubble-${index}`}
                    key={index}
                    initial={{ opacity: 0, scale: 0.85, y: 15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.4, duration: 0.4, type: 'spring' }}
                    className={`flex ${isGuide ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="max-w-[85%]">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isGuide 
                          ? 'bg-white text-charcoal rounded-tl-none' 
                          : 'bg-terracotta text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="block text-[8px] font-mono text-warm-gray/70 mt-1 px-1 text-right">
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulated Input Bar */}
            <div className="px-3 pt-2 bg-white border-t border-warm-gray/10">
              <div className="bg-sand/70 rounded-full px-4 py-2 flex items-center justify-between text-[10px] text-warm-gray font-mono">
                <span>Message...</span>
                <span className="text-terracotta font-bold text-xs">Send</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Checklist Description Column (Right on desktop) */}
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-4">
          <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal leading-tight">
            Plan your visit with complete confidence
          </h3>
          <p className="text-warm-gray text-base leading-relaxed">
            Desert adventures are magical when organized correctly. Our team sends pre-trip tips, coordinates pick-ups, and answers questions directly over WhatsApp or SMS so you know exactly what to bring.
          </p>
        </div>

        {/* 3 Practical Tips */}
        <div className="space-y-4 pt-2">
          {tips.map((tip, idx) => (
            <motion.div
              id={`tip-box-${idx}`}
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.4 }}
              className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-warm-gray/10 shadow-3xs"
            >
              <div className="p-2 rounded-full bg-sand text-terracotta shrink-0 mt-0.5">
                <Check className="w-4 h-4 font-bold" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-charcoal">
                  {tip.title}
                </h4>
                <p className="text-warm-gray text-xs leading-relaxed mt-0.5">
                  {tip.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-6 pt-4 text-xs font-mono text-warm-gray">
          <span className="inline-flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Certified Safety Guides</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <Heart className="w-4 h-4 text-terracotta fill-terracotta" />
            <span>24/7 Local Support</span>
          </span>
        </div>
      </div>

    </div>
  );
}
