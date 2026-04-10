import React from 'react';
import { motion } from 'framer-motion';
import { Export, Funnel, Plus, UploadSimple } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onAddSubscription: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddSubscription }) => {
  const navigate = useNavigate();

  const actions = [
    {
      name: 'Add Subscription',
      icon: <Plus size={18} weight="bold" />,
      onClick: onAddSubscription,
      primary: true,
    },
    {
      name: 'Import',
      icon: <UploadSimple size={18} weight="bold" />,
      onClick: () => navigate('/subscriptions'),
      primary: false,
    },
    {
      name: 'Export',
      icon: <Export size={18} weight="bold" />,
      onClick: () => window.print(),
      primary: false,
    },
    {
      name: 'Filter',
      icon: <Funnel size={18} weight="bold" />,
      onClick: () => navigate('/subscriptions'),
      primary: false,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <motion.button
          key={action.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className={
            action.primary
              ? 'rounded-2xl bg-[linear-gradient(135deg,#d56dff_0%,#7a38ff_55%,#4d56ff_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(117,74,255,0.34)] transition-all hover:shadow-[0_22px_54px_rgba(117,74,255,0.42)]'
              : 'glass-card rounded-2xl border-white/10 px-4 py-3 text-sm font-medium text-white/78 transition-all hover:bg-white/[0.12]'
          }
        >
          <span className="inline-flex items-center gap-2">
            {action.icon}
            <span className="hidden sm:inline">{action.name}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
