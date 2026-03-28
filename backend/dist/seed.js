import { JSONFilePreset } from 'lowdb/node';
import { demoUser, demoPrediction } from './demoUser.js';
async function seed() {
    console.log('Seeding Lowdb database...');
    const defaultData = { user: demoUser, prediction: demoPrediction };
    // Initialize db.json
    const db = await JSONFilePreset('db.json', defaultData);
    // Force write the current demo data to ensure it is in the DB
    db.data = defaultData;
    await db.write();
    console.log('Database seeded successfully at db.json!');
}
seed().catch(console.error);
//# sourceMappingURL=seed.js.map