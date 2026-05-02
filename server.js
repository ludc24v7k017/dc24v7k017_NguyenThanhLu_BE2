const app = require('./app');
const config = require('./app/config');
const MongoDB = require('./app/utils/mongodb.util');

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Connected to MongoDB");
        
        const port = config.app.port;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit();
    }
}

startServer();