import { motion } from 'framer-motion';
import { TrendingUp, Activity, ActivitySquare } from 'lucide-react';
import { useAppStore } from '@/store';
import { format } from 'date-fns';
import { CycleHistoryChart } from './CycleHistoryChart';

export const InsightsView = () => {
    const { cycles, predictions } = useAppStore();

    // Dynamic logic based on parsed backend data
    let periodPredictionText = "Loading prediction...";
    let cycleCount = cycles.length - 1;

    // console.log(cycles);
    if (predictions) {
        periodPredictionText = `Based on historical data (${predictions?.averageCycleLength * cycleCount}-day rolling average), your period is most likely to start around ${format(predictions.start_date, 'MMM d')}.`;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-light text-[var(--color-slate)]">Insights</h2>
                <div className="p-2 bg-white rounded-full shadow-sm text-[var(--color-slate)]"><TrendingUp size={20} /></div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--color-slate)] px-2">Pattern Analysis</h3>
                <div className="glass-card p-5 border-l-4 border-l-[var(--color-sage-dark)] shadow-sm">
                    <h4 className="font-semibold text-[var(--color-slate)] mb-2 flex items-center space-x-2">
                        <Activity size={18} />
                        <span>Cycle Consistency</span>
                    </h4>
                    <p className="text-sm text-[var(--color-slate)]/70 leading-relaxed">
                        {/* {cycleCount >= 2
                            ? `Your previous ${cycleCount} cycles averaged ${averagePeriodLength} days. This creates a solid baseline meaning your fertile window estimates have higher confidence.`
                            : `Keep logging! Once you log multiple cycles, we establish your baseline. We're currently assuming a standard 28-day cycle.`
                        } */}

                        Your previous {cycleCount} cycles averaged {predictions?.averagePeriodLength} days. This creates a solid baseline meaning your fertile window estimates have higher confidence.
                    </p>
                </div>
                <div className="glass-card p-5 border-l-4 border-l-[var(--color-terracotta)] shadow-sm">
                    <h4 className="font-semibold text-[var(--color-slate)] mb-2 flex items-center space-x-2">
                        <ActivitySquare size={18} />
                        <span>Expected Menstruation</span>
                    </h4>
                    <p className="text-sm text-[var(--color-slate)]/70 leading-relaxed">
                        {periodPredictionText}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--color-slate)] px-2">Long-Term Trends</h3>
                <div className="glass-card p-6 min-h-[160px] flex items-center justify-center border border-[var(--color-sand)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-sand)] to-transparent opacity-50"></div>
                    <div className="z-10 w-full h-full flex flex-col justify-center">
                        <CycleHistoryChart cycles={cycles} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
