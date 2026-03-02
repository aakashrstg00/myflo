import { motion } from 'framer-motion';

export const CycleRing = ({ dayOfCycle, totalDays = 28, phase, cycleDays }: { dayOfCycle: number, totalDays?: number, phase?: string, cycleDays?: number }) => {
    const radius = 120;
    const strokeWidth = 16;
    const circumference = 2 * Math.PI * radius;
    const progress = (dayOfCycle / totalDays) * circumference;

    return (
        <div className="relative flex justify-center items-center py-8">
            <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} className="transform -rotate-90">
                <circle
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    stroke="var(--color-sand)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Follicular Phase / Fertile Window Indicator */}
                <circle
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    stroke="var(--color-sage-light)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (17 / totalDays) * circumference}
                    className="opacity-50"
                />
                {/* Current phase progress */}
                <motion.circle
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    stroke="var(--color-terracotta)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-light text-[var(--color-slate)]">Day {dayOfCycle}</span>
                <span className="text-sm text-[var(--color-slate)]/70 uppercase tracking-widest mt-1">of {cycleDays}</span>
                <span className="text-sm text-[var(--color-slate)]/70 uppercase tracking-widest mt-1">{phase}</span>
                <span className="text-xs text-[var(--color-slate)]/50 mt-2">{totalDays - dayOfCycle} Days Left <br />till next period</span>
            </div>
        </div>
    );
};
