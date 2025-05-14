import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '../../styles/medicinedescriptionpage.module.css';

export default function FAQSection({ faqs, prescriptionRequired }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Toggle FAQ answer visibility
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Default FAQs if none provided
  const defaultFaqs = [
    { 
      question: "Can I use this product without a prescription?", 
      answer: prescriptionRequired ? 
        "No, this product requires a valid prescription from a licensed healthcare professional." : 
        "Yes, this product can be purchased without a prescription."
    },
    { 
      question: "What should I do if I miss a dose?", 
      answer: "If you miss a dose, take it as soon as you remember. If it's almost time for your next dose, skip the missed dose and continue with your regular dosing schedule. Do not take a double dose to make up for a missed one."
    },
    { 
      question: "Can I use this during pregnancy?", 
      answer: "It's best to consult with your doctor before using this product during pregnancy or breastfeeding."
    },
    { 
      question: "How should I store this product?", 
      answer: "Store in a cool, dry place away from direct sunlight and keep out of reach of children. Do not use after the expiry date."
    }
  ];

  const faqsToDisplay = faqs?.length ? faqs : defaultFaqs;

  return (
    <div className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

      <div className={styles.faqList}>
        {faqsToDisplay.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <button 
              className={`${styles.faqQuestion} ${openFaqIndex === index ? styles.activeFaq : ''}`}
              onClick={() => toggleFaq(index)}
              aria-expanded={openFaqIndex === index}
            >
              <span>{faq.question}</span>
              <ChevronDown 
                size={20} 
                className={openFaqIndex === index ? styles.rotateIcon : ''}
              />
            </button>
            {faq.answer && (
              <div 
                className={`${styles.faqAnswer} ${openFaqIndex === index ? styles.faqAnswerVisible : ''}`}
                style={{ 
                  maxHeight: openFaqIndex === index ? '1000px' : '0',
                  opacity: openFaqIndex === index ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
