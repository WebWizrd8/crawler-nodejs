import { getChainEndpoints, getChains } from "./data/client";
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

function initWorker(id: number, endpoints: string[]) {
  const endpoint = endpoints.shift();
  if (!endpoint) {
    logger.error(`No endpoint provided for chain_id: ${id}`);
    return;
  }

  // cycle endpoints for the next launch
  const shiftedEndpoints = endpoints.concat(endpoint);

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
    initWorker(id, shiftedEndpoints);
  });

  // Handle the worker thread exiting
  worker.on("exit", (code) => {
    if (code !== 0) {
      logger.error(`Worker stopped with exit code ${code}`);
      initWorker(id, shiftedEndpoints);
    }
  });
}

async function main() {
  if (isMainThread) {
    const chains = await getChains();

    chains.forEach(async (chain) => {
      const { id } = chain;
      const chainEndpoints = await getChainEndpoints(id);
      const endpointsUrls = chainEndpoints.map(({ url }) => url);
      initWorker(id, endpointsUrls);
    });
  } else {
    worker(workerData);
  }
}

main();
