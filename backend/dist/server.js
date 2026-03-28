import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { demoUser, demoPrediction } from './demoUser.js';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';
import { JSONFilePreset } from 'lowdb/node';
dotenv.config();
const defaultData = { user: demoUser, prediction: demoPrediction };
const db = await JSONFilePreset('db.json', defaultData);
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Project Aura API'
    });
});
app.get('/api/user', (req, res) => {
    res.json(db.data.user);
});
// Configuration Variable
export let MAX_PAST_MONTHS_CYCLE_LOGGING = 6;
app.get('/api/config', (req, res) => {
    res.json({
        maxPastMonthsCycleLogging: MAX_PAST_MONTHS_CYCLE_LOGGING
    });
});
app.get('/api/predictions', (req, res) => {
    let cycleCount = db.data.user.history.length - 1;
    let averagePeriodLength = Math.round(db.data.user.history.slice(0, -1).reduce((sum, c) => sum + (c.length_days || 0), 0) / cycleCount);
    // calculate average difference in 2 consecutive cycles end dates using date-fns
    const diffs = db.data.user.history
        .slice(0, -1)
        .map((c, i) => {
        if (i === 0)
            return 0;
        const prevCycle = db.data.user.history[i - 1];
        if (!prevCycle?.end_date || !c.end_date)
            return 0;
        const diff = Math.abs(differenceInCalendarDays(new Date(c.end_date), new Date(prevCycle.end_date)));
        return diff;
    })
        .slice(1);
    let averageCycleLength = Math.round(diffs.reduce((sum, d) => sum + d, 0) / diffs.length);
    res.json({
        predictions: {
            ...db.data.prediction,
            averageCycleLength: averageCycleLength,
            averagePeriodLength: averagePeriodLength
        }
    });
});
app.get('/api/current_period', (req, res) => {
    res.json(db.data.user.current_period_logs);
});
app.get('/api/cycles', async (req, res) => {
    const cycles = db.data.user.history.map((cycle) => ({
        start_date: cycle.start_date,
        end_date: cycle.end_date,
        length_days: cycle.length_days
    }));
    res.json({
        cycles: cycles
    });
});
app.post('/api/cycles', async (req, res) => {
    const { start_date, end_date } = req.body;
    if (!start_date || !end_date) {
        res.status(400).json({
            error: 'start_date and end_date are required'
        });
        return;
    }
    const start = new Date(start_date);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (monthsDiff > MAX_PAST_MONTHS_CYCLE_LOGGING) {
        res.status(400).json({
            error: `Cannot log cycles older than ${MAX_PAST_MONTHS_CYCLE_LOGGING} months`
        });
        return;
    }
    const newCycle = {
        start_date,
        end_date,
        length_days: differenceInDays(end_date, start_date)
    };
    db.data.user.history.push(newCycle);
    db.data.user.history.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
    await db.write();
    res.status(201).json({
        message: 'Cycle logged successfully',
        cycle: newCycle
    });
});
app.get('/api/daily-logs', (req, res) => {
    const today = new Date().toISOString().split('T')[0] || '';
    const existingLog = db.data.user.current_period_logs.find(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0] || '';
        return logDate === today;
    });
    if (existingLog) {
        res.json(existingLog);
    }
    else {
        res.json({ flow_intensity: null, symptom_type: null });
    }
});
app.post('/api/check-in', async (req, res) => {
    const completedCycles = db.data.user.history.filter((c) => c.end_date !== null && c.length_days !== null);
    if (completedCycles.length === 0) {
        res.json({ message: 'No completed cycles, cannot auto-end.' });
        return;
    }
    const averagePeriodLength = Math.round(completedCycles.reduce((sum, c) => sum + (c.length_days || 0), 0) / completedCycles.length);
    const incompleteCycle = db.data.user.history.find((c) => !c.end_date);
    if (!incompleteCycle) {
        res.json({ message: 'No active period to auto-end.' });
        return;
    }
    const start = new Date(incompleteCycle.start_date);
    const now = new Date();
    // Using differenceInDays(end, start)
    const currentLength = differenceInDays(now, start);
    if (currentLength > averagePeriodLength) {
        incompleteCycle.end_date = now.toISOString().split('T')[0] || '';
        incompleteCycle.length_days = currentLength;
        await db.write();
        res.json({ message: 'Period auto-ended.', cycle: incompleteCycle, autoEnded: true });
        return;
    }
    res.json({ message: 'Period still active.', currentLength, averagePeriodLength, autoEnded: false });
});
app.post('/api/daily-logs', async (req, res) => {
    const { flow_intensity, symptom_type } = req.body;
    if (!flow_intensity && !symptom_type) {
        res.status(400).json({ error: 'At least one of flow_intensity or symptom_type is required' });
        return;
    }
    const today = new Date().toISOString().split('T')[0] || '';
    // check if a log exists for today
    const existingLog = db.data.user.current_period_logs.find(log => {
        // compare dates
        const logDate = new Date(log.date).toISOString().split('T')[0] || '';
        return logDate === today;
    });
    if (existingLog) {
        if (flow_intensity !== undefined)
            existingLog.flow_intensity = flow_intensity;
        if (symptom_type !== undefined)
            existingLog.symptom_type = symptom_type;
        await db.write();
        res.json({ message: 'Log updated', log: existingLog });
    }
    else {
        const newLog = {
            id: `d${db.data.user.current_period_logs.length + 1}`,
            date: new Date(today),
            flow_intensity: flow_intensity || null,
            symptom_type: symptom_type || null
        };
        db.data.user.current_period_logs.push(newLog);
        await db.write();
        res.status(201).json({ message: 'Log created', log: newLog });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=server.js.map