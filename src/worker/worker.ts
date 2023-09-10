import { parentPort } from "worker_threads";
import WebSocket from "ws";
import { EthMessageMethod, IWorkerData, WorkerMessage } from "../types/worker";

let id = 0

export const worker = ({endpoint}: IWorkerData) => {
  const logSubscribePayload = {
    jsonrpc: "2.0",
    id: id++,
    method: "eth_subscribe",
    params: ["logs", {}],
  };
  if (!endpoint) {
    console.log("no endpoint provided");
    return;
  }

  console.log(endpoint);

  const ws = new WebSocket(endpoint);

  ws.on("open", () => {
    ws.send(JSON.stringify(logSubscribePayload));
  });

  ws.on("message", (data: string) => {
    console.log(`received: ${data} \n`)
    const ethMessage = JSON.parse(data)

    if (!ethMessage.params?.result?.transactionHash) {
      return
    }

    if (ethMessage.method === EthMessageMethod.Subscription) {
      const transactionPayload = {
        jsonrpc: '2.0',
        id: id++,
        method: "eth_getTransactionByHash",
        params: [ethMessage?.params?.result?.transactionHash]
      }
      ws.send(JSON.stringify(transactionPayload))
    }
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
