import { parentPort } from "worker_threads";
import WebSocket from "ws";
import { IWorkerData, WorkerMessage } from "../types/worker";

export const worker = (workerData: IWorkerData) => {
  const payload = {
    jsonrpc: "2.0",
    id: workerData.chainId,
    method: "eth_subscribe",
    params: ["logs", {}],
  };
  if (!workerData?.endpoint) {
    console.log("no endpoint provided");
    return;
  }

  console.log(workerData?.endpoint);

  const ws = new WebSocket(workerData.endpoint);

  ws.on("open", () => {
    ws.send(JSON.stringify(payload));
  });

  ws.on("message", (data) => {
    console.log(`received: ${data} \n`)
  });

  parentPort?.on("message", (message: WorkerMessage) => {
    switch (message) {
      case WorkerMessage.Exit:
        process.exit();
    }
    // Perform some work in the worker thread
    // const result = doWork(message);

    // console.log({workerData})
  });
};
