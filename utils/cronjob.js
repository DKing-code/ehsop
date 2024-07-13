const otpModel = require('../models/emailOtpModel')
const cron = require('node-cron');


function runCronJob(){

    // Define your cron job to run every 2 seconds
    cron.schedule('*/2 * * * * *', async () => {
    // This function will run every 10 minutes

    // Calculate the timestamp 4 minutes ago
    const tenMinutesAgo = new Date(Date.now() - 4 * 60 * 1000);

    try {
        // Find entries older than 10 minutes
        const entriesToDelete = await otpModel.find({ createdAt: { $lt: tenMinutesAgo } });

        if(entriesToDelete.length > 0) {
                // Delete entries older than 10 minutes
            await otpModel.deleteMany({ createdAt: { $lt: tenMinutesAgo } });
            console.log(`${entriesToDelete.length} entries deleted.`);
        }
        
    } catch (err) {
        console.error('Error deleting entries:', err);
    }
    });

}

module.exports = runCronJob