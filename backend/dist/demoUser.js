export const demoUser = {
    id: 'u1',
    email: 'dee.u1@gmail.com',
    name: 'Dee',
    created_at: new Date('2026-02-28'),
    timezone_preference: 'IST',
    is_active: true,
    is_partner: false,
    current_period_logs: [{
            id: 'd1',
            date: new Date('2026-03-27'),
            flow_intensity: 'Heavy',
            symptom_type: 'Cramps',
        }
    ],
    history: [{
            start_date: '2025-12-31',
            end_date: '2026-01-04',
            length_days: 5
        },
        {
            start_date: '2026-01-30',
            end_date: '2026-02-03',
            length_days: 5
        },
        {
            start_date: '2026-02-28',
            end_date: '2026-03-04',
            length_days: 5
        },
        {
            start_date: '2026-03-27',
            end_date: null,
            length_days: null
        }
    ],
    partnerLinksAsPrimary: [],
    partnerLinksAsPartner: [],
};
export const demoPrediction = {
    user_id: 'u1',
    start_date: new Date('2026-04-26'),
    end_date: new Date('2026-04-30'),
    confidence_interval_days: 5
};
//# sourceMappingURL=demoUser.js.map