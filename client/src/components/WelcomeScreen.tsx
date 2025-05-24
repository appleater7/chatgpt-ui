import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard, SampleQuestion } from '@/types';

interface WelcomeScreenProps {
  featureCards: FeatureCard[];
  sampleQuestions: SampleQuestion[];
  onSampleQuestionClick: (question: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  featureCards, 
  sampleQuestions, 
  onSampleQuestionClick 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full flex flex-col gap-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center"
        >
          How can I help you today?
        </motion.h2>
        
        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.3 }}
              className="bg-dark-tertiary dark:bg-dark-tertiary border border-dark-border rounded-xl p-6 hover:bg-opacity-80 transition-colors duration-200 cursor-pointer"
            >
              <img 
                src={card.imageUrl}
                alt={card.altText} 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
              <p className="text-sm opacity-80">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="mb-3 text-sm opacity-80">Try asking something</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
            {sampleQuestions.map((question, index) => (
              <motion.button 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                className="text-left p-3 bg-dark-tertiary dark:bg-dark-tertiary rounded-lg text-sm hover:bg-opacity-80 transition-colors duration-200"
                onClick={() => onSampleQuestionClick(question.text)}
              >
                "{question.text}"
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
