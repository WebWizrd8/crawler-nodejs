import { SCROLL_ENDPOINT_URL, ETH_ENDPOINT_URL } from "./constants/env";
import { WorkerMessage } from "./types/worker";
import { worker } from "./worker/worker";
import winston from "winston";
import { Worker, isMainThread, workerData } from "worker_threads";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "crawler-node" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

function initWorker(id: number, endpoint: string) {
  const worker = new Worker("./build/worker/main.js", {
    workerData: {
      chainId: id,
      endpoint,
      trackLastNTransactions: 1000,
    },
  });

  // Send data to the worker thread
  worker.postMessage(WorkerMessage.Test);

  // Receive messages from the worker thread
  worker.on("message", (message) => {
    logger.debug(`Received from worker: ${message}`);
  });

  // Handle errors from the worker thread
  // TODO: handle different errors here
  worker.on("error", (error) => {
    logger.error(`Worker error: ${error}`);
    initWorker(id, endpoint);
  });

  // Handle the worker thread exiting
  worker.on("exit", (code) => {
    if (code !== 0) {
      logger.error(`Worker stopped with exit code ${code}`);
      initWorker(id, endpoint);
    }
  });
}

function main() {
  if (isMainThread) {
    initWorker(1, SCROLL_ENDPOINT_URL);
    initWorker(2, ETH_ENDPOINT_URL);
  } else {
    worker(workerData);
  }
}

main();
