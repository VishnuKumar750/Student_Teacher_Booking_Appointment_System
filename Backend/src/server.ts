import app from "./app";

import { config } from "./config/app.config";
import { connectDB, disconnectedDB } from "./config/db.config";

const PORT = config.PORT;
let server: any;

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);
  process.exit(1);
});

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed");
      });
    }

    await disconnectedDB();
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown", err);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGHUP", shutdown);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
