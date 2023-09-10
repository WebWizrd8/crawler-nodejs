import { ENDPOINT_URL } from "./constants/env";
import { WorkerMessage } from "./types/worker";
import { worker } from "./worker/worker";

import { Worker, isMainThread, workerData } from "worker_threads";

function initWorker(id: number) {
  const worker = new Worker("./build/worker/main.js", {
    workerData: {
      chainId: id,
      endpoint: ENDPOINT_URL,
    },
  });

  // Send data to the worker thread
  worker.postMessage(WorkerMessage.Test);

  // Receive messages from the worker thread
  worker.on("message", (message) => {
    console.log(`Received from worker: ${message}`);
  });

  // Handle errors from the worker thread
  worker.on("error", (error) => {
    console.error(`Worker error: ${error}`);
    initWorker(id);
  });

  // Handle the worker thread exiting
  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
      initWorker(id);
    }
  });
}

function main() {
  if (isMainThread) {
    initWorker(1);
  } else {
    worker(workerData);
  }
}

main();
