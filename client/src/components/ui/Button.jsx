import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = ({ children, className, variant = 'primary', ...props }) => {
    const isPrimary = variant === 'primary';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative rounded-lg px-6 py-3 font-semibold transition-all duration-300",
                isPrimary
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10",
                className
            )}
            {...props}
        >
            <span className={cn(isPrimary && "text-glow")}>
                {children}
            </span>
            {isPrimary && (
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-cyan-400/20 blur-[2px]" />
            )}
        </motion.button>
    );
};

export default Button;
