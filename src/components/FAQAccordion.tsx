import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>('1'); // Open first item by default for better visual balance

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="faq-accordion-group" className="space-y-4 max-w-3xl mx-auto">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            id={`faq-item-container-${item.id}`}
            key={item.id}
            className="bg-white rounded-xl border border-warm-gray/10 overflow-hidden transition-all duration-300"
          >
            <button
              id={`faq-btn-${item.id}`}
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none focus:ring-0 group"
            >
              <span className="font-serif text-base sm:text-lg font-bold text-charcoal group-hover:text-terracotta transition-colors">
                {item.question}
              </span>
              <span className={`p-1.5 rounded-full bg-sand text-warm-gray group-hover:text-terracotta transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 text-sm text-warm-gray leading-relaxed border-t border-sand pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
