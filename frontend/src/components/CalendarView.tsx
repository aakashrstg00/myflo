import { motion } from 'framer-motion';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { addDays } from 'date-fns';
import { useAppStore } from '@/store';

export const CalendarView = () => {
    const { cycles, predictions } = useAppStore();

    // Construct active periods modifiers explicitly from cycle start dates
    const periodRanges: DateRange[] = cycles.map(cycle => ({
        from: new Date(cycle.start_date),
        to: cycle.end_date ? new Date(cycle.end_date) : new Date() // If ongoing, assume until today for UI block
        // to: new Date('2026-03-01')
    }));

    // Predict fertile windows off each cycle 
    // Usually standard deviations push it to start_date + 12 days for a 5-day window
    const fertileRanges: DateRange[] = cycles.map(cycle => {
        const pStart = new Date(cycle.start_date);
        return {
            from: addDays(pStart, 12),
            to: addDays(pStart, 16)
        };
    });

    let predictionRanges: DateRange[] = [];
    if (predictions) {
        predictionRanges = [{
            from: new Date(predictions.start_date),
            to: new Date(predictions.end_date)
        }]
    }

    // Provide a valid default starting month for react-day-picker
    const todayDay = new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 pb-10"
        >
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-light text-[var(--color-slate)]">Calendar</h2>
            </div>

            <div className="glass-card p-6 flex justify-center">
                <style>
                    {`
                    .rdp {
                        --rdp-cell-size: 46px; 
                        --rdp-accent-color: var(--color-slate);
                        --rdp-background-color: var(--color-sand);
                        --rdp-outline: 2px solid var(--color-slate);
                        --rdp-cell-size: 50px;
                        margin: 0;
                    }
                    .rdp-caption {
                        padding-bottom: 1rem;
                    }
                    .rdp-day {
                        font-size: 0.95rem;
                        color: var(--color-slate);
                        padding: 4px;
                    }
                    .rdp-selected {
                        font-weight: unset;
                        .rdp-day_button {
                            border: unset !important;
                            cursor: unset !important;
                        }
                    }
                    .rdp-day_button {
                        cursor: unset !important;
                        padding: 20px;
                    }

                    /* Buttons */
                    .rdp-button_previous svg, .rdp-button_next svg {
                        fill: var(--color-terracotta);
                    }

                    /* Period Days */
                    .rdp-day_period > button {
                        background-color: var(--color-terracotta) !important;
                        color: white !important;
                        font-weight: 600;
                        border-radius: 99px;
                    }

                    /* Fertile Window Days */
                    .rdp-day_fertile > button {
                        background-color: var(--color-sage-light) !important;
                        color: var(--color-sage-dark) !important;
                        font-weight: 600;
                        border-radius: 100%;
                    }
                    
                    .rdp-day_prediction > button {
                        background-color: var(--color-pink-dark) !important;
                        color: white !important;
                        font-weight: 600;
                        border-radius: 100%;
                        border: 3px dashed white;
                    }

                    .rdp-day.rdp-day_today > button {
                        border-radius: 100%;
                        border: 4px solid var(--color-info);
                    }
                    
                    .rdp-day_today > button:hover {
                        background-color: var(--color-terracotta-dark) !important;
                    }

                    .rdp-day.rdp-day_today.rdp-day_period > button {
                        border: 4px solid var(--color-terracotta-dark);
                    }
                    .rdp-day.rdp-day_today.rdp-day_fertile > button {
                        border: 4px solid var(--color-sage-dark);
                    }
                    .rdp-day.rdp-day_today.rdp-day_prediction > button {
                        border: 4px solid var(--color-pink-dark);
                    }
                    `}
                </style>
                <DayPicker
                    mode="single"
                    navLayout="around"
                    defaultMonth={todayDay}
                    modifiers={{
                        period: periodRanges,
                        fertile: fertileRanges,
                        today: todayDay,
                        prediction: predictionRanges
                    }}
                    modifiersClassNames={{
                        period: 'rdp-day_period',
                        fertile: 'rdp-day_fertile',
                        today: 'rdp-day_today',
                        prediction: 'rdp-day_prediction'
                    }}
                    showOutsideDays
                    animate={true}
                />
            </div>

            <div className="glass-card p-5 space-y-3">
                <h3 className="font-medium text-[var(--color-slate)]">Legend</h3>
                <div className="flex items-center space-x-3 text-sm text-[var(--color-slate)]/70">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-terracotta)]"></div>
                    <span>Period</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-[var(--color-slate)]/70">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-sage-light)] border border-[var(--color-sage)]"></div>
                    <span>Predicted Fertile Window</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-[var(--color-slate)]/70">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-pink-dark)]"></div>
                    <span>Next Period Prediction</span>
                </div>
            </div>
        </motion.div>
    );
};
