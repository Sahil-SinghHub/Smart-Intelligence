import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? {
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(0, 243, 255, 0.2)"
            } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "glass-panel rounded-xl p-6 relative overflow-hidden group",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
