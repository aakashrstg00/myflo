import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  demoUser,
  demoPrediction
} from './demoUser.js';
import {
  differenceInDays,
  differenceInCalendarDays
} from 'date-fns';

dotenv.config();

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
  res.json(demoUser);
});

// Configuration Variable
export let MAX_PAST_MONTHS_CYCLE_LOGGING = 6;

app.get('/api/config', (req, res) => {
  res.json({
    maxPastMonthsCycleLogging: MAX_PAST_MONTHS_CYCLE_LOGGING
  });
});

app.get('/api/predictions', (req, res) => {
  let cycleCount = demoUser.history.length - 1;
  let averagePeriodLength = Math.round(demoUser.history.slice(0, -1).reduce((sum: number, c: any) => sum + (c.length_days || 0), 0) / cycleCount);

  // calculate average difference in 2 consecutive cycles end dates using date-fns
  const diffs = demoUser.history
    .slice(0, -1)
    .map((c: any, i: number) => {
      if (i === 0) return 0;
      const prevCycle = demoUser.history[i - 1];
      if (!prevCycle?.end_date || !c.end_date) return 0;
      const diff = Math.abs(differenceInCalendarDays(new Date(c.end_date), new Date(prevCycle.end_date)));
      return diff;
    })
    .slice(1);
  let averageCycleLength = Math.round(diffs.reduce((sum: number, d: number) => sum + d, 0) / diffs.length);

  res.json({
    predictions: {
      ...demoPrediction,
      averageCycleLength: averageCycleLength,
      averagePeriodLength: averagePeriodLength
    }
  });
});

app.get('/api/current_period', (req, res) => {
  res.json(demoUser.current_period_logs);
});

app.get('/api/cycles', async (req, res) => {
  const cycles = demoUser.history.map((cycle) => ({
    start_date: cycle.start_date,
    end_date: cycle.end_date,
    length_days: cycle.length_days
  }));

  res.json({
    cycles: cycles
  });
});

app.post('/api/cycles', async (req, res) => {
  const {
    start_date,
    end_date
  } = req.body;
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

  demoUser.history.push(newCycle);
  demoUser.history.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  res.status(201).json({
    message: 'Cycle logged successfully',
    cycle: newCycle
  });
});

app.get('/api/daily-logs', (req, res) => {
  const today = new Date().toISOString().split('T')[0] || '';
  
  const existingLog = demoUser.current_period_logs.find(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0] || '';
      return logDate === today;
  });

  if (existingLog) {
      res.json(existingLog);
  } else {
      res.json({ flow_intensity: null, symptom_type: null });
  }
});

app.post('/api/daily-logs', (req, res) => {
  const { flow_intensity, symptom_type } = req.body;
  if (!flow_intensity && !symptom_type) {
    res.status(400).json({ error: 'At least one of flow_intensity or symptom_type is required' });
    return;
  }

  const today = new Date().toISOString().split('T')[0] || '';
  
  // check if a log exists for today
  const existingLog = demoUser.current_period_logs.find(log => {
      // compare dates
      const logDate = new Date(log.date).toISOString().split('T')[0] || '';
      return logDate === today;
  });

  if (existingLog) {
      if (flow_intensity !== undefined) existingLog.flow_intensity = flow_intensity;
      if (symptom_type !== undefined) existingLog.symptom_type = symptom_type;
      res.json({ message: 'Log updated', log: existingLog });
  } else {
      const newLog = {
          id: `d${demoUser.current_period_logs.length + 1}`,
          date: new Date(today),
          flow_intensity: flow_intensity || null,
          symptom_type: symptom_type || null
      };
      demoUser.current_period_logs.push(newLog);
      res.status(201).json({ message: 'Log created', log: newLog });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});