import { motion } from 'framer-motion';
import {
  BookOpen,
  Shield,
  Lock,
  Bot,
  EyeOff,
  Users,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

const sections = [
  {
    icon: BookOpen,
    title: '1. Educational Use Only',
    content: `IPO Insider is designed exclusively for educational and informational purposes. All IPO data,
    price simulations, lesson content, and portfolio tools are simulated and do not reflect real market
    conditions. Nothing on this platform constitutes financial advice, investment advice, or a
    recommendation to buy or sell any security. Users should conduct their own research and consult a
    licensed financial advisor before making any investment decisions.`,
  },
  {
    icon: Shield,
    title: '2. Copyright & Intellectual Property',
    content: `All content on IPO Insider — including but not limited to text, graphics, lesson materials,
    quiz questions, UI design, data structures, and source code — is protected under applicable copyright
    law. This platform and its content are the intellectual property of its creators. Unauthorized
    reproduction, distribution, or commercial use is strictly prohibited without prior written consent.
    Based on IP Protection Clauses Toolkit by Nakia (IP attorney).`,
  },
  {
    icon: Lock,
    title: '3. No Derivative Works',
    content: `You may not create derivative works, modify, adapt, translate, reverse engineer, decompile,
    or disassemble any part of this platform without express written permission. Screenshots for
    personal, non-commercial, or educational use are permitted provided proper attribution is given
    to IPO Insider.`,
  },
  {
    icon: Bot,
    title: '4. AI Usage Disclaimer',
    content: `Portions of this platform's content, lesson explanations, and educational materials may
    have been generated or assisted by artificial intelligence tools. All AI-generated content has been
    reviewed for accuracy; however, IPO Insider makes no warranty regarding the completeness or
    timeliness of such information. AI-generated explanations are illustrative and not authoritative
    financial guidance.`,
  },
  {
    icon: EyeOff,
    title: '5. Confidentiality',
    content: `Any proprietary trading strategies, platform architecture, data models, or business logic
    disclosed through use of this platform remains confidential. Users agree not to disclose, share, or
    publish internal platform mechanics, unreleased features, or proprietary algorithms without prior
    written approval.`,
  },
  {
    icon: Users,
    title: '6. User Conduct',
    content: `Users agree to use IPO Insider solely for personal educational purposes. Commercial
    exploitation, scraping, automated data collection, or reselling of platform content is prohibited.
    Users accept full responsibility for their own actions and any decisions made based on content
    encountered on this platform.`,
  },
  {
    icon: ExternalLink,
    title: '7. External Links & Trading Disclaimer',
    color: 'amber',
    content: `IPO Insider may contain links to third-party websites, brokerage platforms, financial
    services, or external resources. By clicking any external link, you acknowledge and agree to the
    following:\n\n• You are leaving the IPO Insider educational environment.\n• You are solely and legally
    responsible for any trading, investing, purchasing, or financial decisions you make after leaving
    this site.\n• IPO Insider, its creators, and its operators assume no liability for actions taken on
    external platforms.\n• External sites operate under their own terms of service and privacy policies,
    which you should review independently.`,
  },
  {
    icon: AlertTriangle,
    title: '8. No Affiliation Disclaimer',
    color: 'amber',
    content: `IPO Insider is an independent educational platform. It is NOT affiliated with, endorsed by,
    sponsored by, or in any way connected to the following entities:\n\n• ThinkBox AI Operating Systems\n•
    MJUnlimited Essential Mktg\n\nThese entities are named solely to explicitly disclaim any association.
    Any use of similar branding, terminology, or concepts is coincidental and does not imply partnership,
    endorsement, or affiliation. Users should not interpret anything on this platform as representing the
    views or services of these organizations.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Terms, IP &amp;{' '}
            <span className="gradient-text">Legal Notices</span>
          </h1>
          <p className="text-white/60 text-lg">
            Please read these terms carefully before using IPO Insider.
          </p>
          <p className="text-white/40 text-sm mt-2">
            Last updated: April 2025
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            const isWarning = section.color === 'amber';
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-xl p-6 ${
                  isWarning ? 'border border-amber-500/30 bg-amber-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isWarning
                        ? 'bg-amber-500/20'
                        : 'bg-primary/20'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isWarning ? 'text-amber-400' : 'text-primary'
                      }`}
                    />
                  </div>
                  <div>
                    <h2
                      className={`text-lg font-semibold mb-3 ${
                        isWarning ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {section.title}
                    </h2>
                    <div className="text-white/60 text-sm leading-relaxed space-y-2">
                      {section.content.split('\n\n').map((para, j) => (
                        <p key={j} className="whitespace-pre-line">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-white/30 text-xs space-y-1"
        >
          <p>© 2025 IPO Insider. All rights reserved.</p>
          <p>
            Not affiliated with ThinkBox AI Operating Systems or MJUnlimited Essential Mktg.
          </p>
          <p>For questions, contact the platform administrator.</p>
        </motion.div>
      </div>
    </div>
  );
}
