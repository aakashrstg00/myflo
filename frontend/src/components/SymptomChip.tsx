import { useState, useEffect } from 'react';

export const SymptomChip = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 cursor-pointer rounded-full flex items-center space-x-2 text-sm transition-all duration-200 border shadow-sm ${active
                ? 'bg-[var(--color-terracotta)] text-white border-[var(--color-terracotta)] shadow-md'
                : 'bg-white text-[var(--color-slate)] border-[var(--color-sand)] hover:bg-[var(--color-sand)]/50'
                }`}
        >
            <span>{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
};

export const QuickLogTray = () => {
    const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
    const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodayLog = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/daily-logs');
                const data = await res.json();
                if (data.flow_intensity) setSelectedFlow(data.flow_intensity);
                if (data.symptom_type) setSelectedSymptom(data.symptom_type);
            } catch (err) {
                console.error("Failed to fetch today's log", err);
            }
        };
        fetchTodayLog();
    }, []);

    const updateBackend = async (flow: string | null, symptom: string | null) => {
        if (!flow && !symptom) return; // Backend requires at least one
        try {
            await fetch('http://localhost:4000/api/daily-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    flow_intensity: flow,
                    symptom_type: symptom
                })
            });
        } catch (error) {
            console.error('Failed to update log', error);
        }
    };

    const handleFlowChange = (label: string) => {
        const newFlow = selectedFlow === label ? null : label;
        setSelectedFlow(newFlow);
        updateBackend(newFlow, selectedSymptom);
    };

    const handleSymptomChange = (label: string) => {
        const newSymptom = selectedSymptom === label ? null : label;
        setSelectedSymptom(newSymptom);
        updateBackend(selectedFlow, newSymptom);
    };

    return (
        <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-medium text-[var(--color-slate)] mb-4">Log Today</h3>

            <div className="space-y-6">
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-[var(--color-slate)]/60 mb-3">Flow</h4>
                    <div className="flex flex-wrap gap-2">
                        <SymptomChip icon="🩸" label="Light" active={selectedFlow === 'Light'} onClick={() => handleFlowChange('Light')} />
                        <SymptomChip icon="🩸🩸" label="Medium" active={selectedFlow === 'Medium'} onClick={() => handleFlowChange('Medium')} />
                        <SymptomChip icon="🩸🩸🩸" label="Heavy" active={selectedFlow === 'Heavy'} onClick={() => handleFlowChange('Heavy')} />
                    </div>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-widest text-[var(--color-slate)]/60 mb-3">Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                        <SymptomChip icon="⚡" label="Cramps" active={selectedSymptom === 'Cramps'} onClick={() => handleSymptomChange('Cramps')} />
                        <SymptomChip icon="🪫" label="Low Energy" active={selectedSymptom === 'Low Energy'} onClick={() => handleSymptomChange('Low Energy')} />
                        <SymptomChip icon="🧠" label="Brain Fog" active={selectedSymptom === 'Brain Fog'} onClick={() => handleSymptomChange('Brain Fog')} />
                        <SymptomChip icon="🌊" label="Bloating" active={selectedSymptom === 'Bloating'} onClick={() => handleSymptomChange('Bloating')} />
                    </div>
                </div>
            </div>
        </div>
    );
};
