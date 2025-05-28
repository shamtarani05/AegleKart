import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ThumbsUp, ThumbsDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/faqs.module.css';

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'products', name: 'Products' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'account', name: 'Account & Membership' },
  ];

  const faqData = {
    general: [
      {
        id: 'g1',
        question: 'What is Herbal Remedies?',
        answer: 'Herbal Remedies is a leading provider of natural health solutions, offering a wide range of traditional herbal products developed with the perfect balance of ancient wisdom and modern scientific research. Founded in 1998, we have over two decades of experience in delivering high-quality herbal supplements, teas, tinctures, and wellness products.'
      },
      {
        id: 'g2',
        question: 'Are your products organic?',
        answer: 'Many of our products are certified organic. We prioritize organic ingredients whenever possible and clearly label our products accordingly. Our commitment to sustainability means we source ingredients from responsible farms and wild-crafters who follow ethical harvesting practices.'
      },
      {
        id: 'g3',
        question: 'Do your products contain allergens?',
        answer: 'All potential allergens are clearly labeled on our product packaging. Common allergens in some of our products may include tree nuts, bee products, or certain herbs that some individuals may be sensitive to. If you have specific allergies, please consult the product description or contact our customer support team for detailed information.'
      },
      {
        id: 'g4',
        question: 'How do I know which product is right for me?',
        answer: 'We offer several resources to help you find the right products for your needs. You can use our website\'s product filter to narrow down options based on health concerns, ingredients, or product type. For personalized recommendations, consider scheduling a consultation with one of our herbalists or contact our customer support team who can provide guidance based on your specific needs.'
      },
    ],
    products: [
      {
        id: 'p1',
        question: 'How should I store my herbal products?',
        answer: 'Most herbal products should be stored in a cool, dry place away from direct sunlight. Tinctures and liquid extracts typically have a longer shelf life than dried herbs and teas. Refrigeration is recommended for some products after opening, which will be indicated on the packaging. Always check the product label for specific storage instructions.'
      },
      {
        id: 'p2',
        question: 'What is the shelf life of your products?',
        answer: 'The shelf life varies by product type. Generally, dried herbs and teas remain potent for 1-2 years, tinctures for 3-5 years, and capsules for 2-3 years from the manufacturing date. Every product includes an expiration or "best by" date on the packaging. For optimal potency, we recommend using products before this date.'
      },
      {
        id: 'p3',
        question: 'Do your products undergo testing?',
        answer: 'Yes, all our products undergo rigorous quality testing. We test for potency, purity, and contamination including heavy metals, pesticides, and microbial content. Our testing is conducted by both in-house and independent third-party laboratories to ensure the highest standards of quality and safety.'
      },
      {
        id: 'p4',
        question: 'Are your products FDA approved?',
        answer: 'Herbal supplements are not approved by the FDA in the same way as pharmaceutical drugs. However, we follow all FDA guidelines for Good Manufacturing Practices (GMP) in the production of dietary supplements. Our facility is regularly inspected, and we maintain strict quality control standards that meet or exceed industry requirements.'
      },
    ],
    orders: [
      {
        id: 'o1',
        question: 'How long will it take to receive my order?',
        answer: 'Domestic orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days, while expedited shipping options are available at checkout. International shipping times vary by location but generally take 7-14 business days. You will receive a tracking number once your order ships so you can monitor its progress.'
      },
      {
        id: 'o2',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please note that some products may not be available for international shipping due to country-specific import regulations. Additional customs duties and taxes may apply and are the responsibility of the recipient.'
      },
      {
        id: 'o3',
        question: 'Can I modify or cancel my order?',
        answer: 'Orders can be modified or canceled within 2 hours of placement. After this window, our fulfillment process begins and changes cannot be guaranteed. To request a modification or cancellation, please contact our customer service team immediately with your order number.'
      },
      {
        id: 'o4',
        question: 'Is there a minimum order amount?',
        answer: 'There is no minimum order amount required to make a purchase. However, orders under $25 incur a small handling fee. Orders over $50 qualify for free standard shipping within the continental United States. We also offer periodic promotions that may include free shipping at different threshold amounts.'
      },
    ],
    returns: [
      {
        id: 'r1',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day satisfaction guarantee on most products. If you\'re not completely satisfied with your purchase, you can return unopened products in their original packaging for a full refund, or opened products for store credit. Certain items like custom formulations and clearance products are final sale and cannot be returned unless defective.'
      },
      {
        id: 'r2',
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, please contact our customer service team or fill out the return form on our website. You\'ll need to provide your order number, the items you wish to return, and the reason for the return. Once approved, you\'ll receive return shipping instructions and a return authorization number.'
      },
      {
        id: 'r3',
        question: 'Who pays for return shipping?',
        answer: 'Customers are responsible for return shipping costs unless the return is due to our error (such as sending the wrong product or a defective item). In these cases, we will provide a prepaid return shipping label. We recommend using a trackable shipping method for all returns.'
      },
      {
        id: 'r4',
        question: 'How long do refunds take to process?',
        answer: 'Once we receive your return, our team will inspect the items and process your refund within 3-5 business days. The refund will be issued to the original payment method used for the purchase. Please allow an additional 3-7 business days for the refund to appear in your account, depending on your financial institution.'
      },
    ],
    account: [
      {
        id: 'a1',
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Account" icon in the top right corner of our website and select "Register." You\'ll need to provide your email address and create a password. You can also register during the checkout process. Having an account allows you to track orders, save favorites, and access exclusive member benefits.'
      },
      {
        id: 'a2',
        question: 'What are the benefits of creating an account?',
        answer: 'Account members enjoy several benefits including order tracking, faster checkout, saved shopping lists, access to order history, exclusive promotions, and the ability to earn and redeem loyalty points. Members also receive our newsletter with health tips, product updates, and special offers (you can opt-out anytime).'
      },
      {
        id: 'a3',
        question: 'I forgot my password. How do I reset it?',
        answer: 'If you\'ve forgotten your password, click on "Login" and then select "Forgot Password." Enter the email address associated with your account, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password. The reset link is valid for 24 hours.'
      },
      {
        id: 'a4',
        question: 'How does your loyalty program work?',
        answer: 'Our Herbal Rewards program allows you to earn points on every purchase. You\'ll earn 1 point for every dollar spent, and points can be redeemed for discounts on future orders. Members also receive bonus points on their birthday, anniversary, and during special promotions. Points expire after 12 months of inactivity.'
      },
    ],
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const provideFeedback = (questionId, isHelpful) => {
    setHelpfulFeedback((prev) => ({
      ...prev,
      [questionId]: isHelpful
    }));
  };

  const filteredFaqData = searchQuery 
    ? Object.values(faqData).flat().filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory];

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
            <p className={styles.heroSubtitle}>Find answers to common questions about our products and services</p>
            
            <div className={styles.searchContainer}>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search questions and answers..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories and Questions */}
        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            {!searchQuery && (
              <div className={styles.categoryTabs}>
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`${styles.categoryTab} ${activeCategory === category.id ? styles.activeTab : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
            
            <div className={styles.faqList}>
              {searchQuery && filteredFaqData.length === 0 ? (
                <div className={styles.noResults}>
                  <p>No results found for "{searchQuery}"</p>
                  <p>Try different keywords or browse by category</p>
                </div>
              ) : (
                filteredFaqData.map((faq) => (
                  <div key={faq.id} className={styles.faqItem}>
                    <div 
                      className={styles.faqQuestion}
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <h3>{faq.question}</h3>
                      {expandedQuestions[faq.id] ? 
                        <ChevronUp className={styles.chevronIcon} /> : 
                        <ChevronDown className={styles.chevronIcon} />
                      }
                    </div>
                    
                    {expandedQuestions[faq.id] && (
                      <div className={styles.faqAnswer}>
                        <p>{faq.answer}</p>
                        
                        <div className={styles.feedbackContainer}>
                          <p className={styles.feedbackQuestion}>Was this answer helpful?</p>
                          <div className={styles.feedbackButtons}>
                            <button 
                              className={`${styles.feedbackButton} ${helpfulFeedback[faq.id] === true ? styles.activeButton : ''}`}
                              onClick={() => provideFeedback(faq.id, true)}
                              disabled={helpfulFeedback[faq.id] !== undefined}
                            >
                              <ThumbsUp size={16} />
                              <span>Yes</span>
                            </button>
                            <button 
                              className={`${styles.feedbackButton} ${helpfulFeedback[faq.id] === false ? styles.activeButton : ''}`}
                              onClick={() => provideFeedback(faq.id, false)}
                              disabled={helpfulFeedback[faq.id] !== undefined}
                            >
                              <ThumbsDown size={16} />
                              <span>No</span>
                            </button>
                          </div>
                          
                          {helpfulFeedback[faq.id] !== undefined && (
                            <p className={styles.feedbackThankYou}>Thank you for your feedback!</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Still Need Help Section */}
        <section className={styles.needHelpSection}>
          <div className={styles.needHelpContainer}>
            <h2 className={styles.needHelpTitle}>Still Need Help?</h2>
            <p className={styles.needHelpText}>
              Can't find the answer you're looking for? Please reach out to our friendly customer support team.
            </p>
            
            <div className={styles.helpOptions}>
              <div className={styles.helpOption}>
                <div className={styles.helpIconContainer}>
                  <Mail className={styles.helpIcon} />
                </div>
                <h3>Email Us</h3>
                <p>Get a response within 24 hours</p>
                <a href="mailto:support@herbalremedies.com" className={styles.helpButton}>
                  Send Email
                </a>
              </div>
              
              <div className={styles.helpOption}>
                <div className={styles.helpIconContainer}>
                  <Phone className={styles.helpIcon} />
                </div>
                <h3>Call Us</h3>
                <p>Available Mon-Fri, 9am to 6pm EST</p>
                <a href="tel:+18005551234" className={styles.helpButton}>
                  1-800-555-1234
                </a>
              </div>
              
              <div className={styles.helpOption}>
                <div className={styles.helpIconContainer}>
                  <MessageSquare className={styles.helpIcon} />
                </div>
                <h3>Live Chat</h3>
                <p>Chat with our team in real-time</p>
                <button className={styles.helpButton}>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Add missing imports
const Mail = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
};

const Phone = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
};

const MessageSquare = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

export default FAQs;