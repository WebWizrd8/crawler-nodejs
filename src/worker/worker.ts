import { parentPort } from "worker_threads";
import WebSocket from "ws";
import { EthMessageMethod, IWorkerData, WorkerMessage } from "../types/worker";
import { getLastTransactionsStorage } from "../utils/transactionHashStorage";
import winston from "winston";
import { Socket } from "net";
import { NOTIFICATION_SOCKET } from "../constants/env"
import { convertNumericProps } from "../utils/convertNumericProps";
import { getDestinationsForTransaction } from "../data/client";

let id = 0;

export const worker = ({
  chainId,
  endpoint,
  trackLastNTransactions,
}: IWorkerData) => {
  const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    defaultMeta: { service: `chain ${chainId}` },
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });
  const logSubscribePayload = {
    jsonrpc: "2.0",
    id: id++,
    method: "eth_subscribe",
    params: ["logs", {}],
  };
  if (!endpoint) {
    logger.error("no endpoint provided");
    process.exit();
  }
  const hashTracker = getLastTransactionsStorage(trackLastNTransactions);

  const ws = new WebSocket(endpoint);

  const notificationQueue = new Socket();
  notificationQueue.connect(NOTIFICATION_SOCKET, () => {
    console.log("connected to notification socket");
  })

  const handleMessage = async (data: string) => {
    // logger.debug(`received: ${data} \n`);
    const ethMessage = JSON.parse(data);

    if (ethMessage.method === EthMessageMethod.Subscription && ethMessage.params?.result?.transactionHash) {
      const transactionHash = ethMessage.params.result.transactionHash;
      if (!hashTracker.has(transactionHash)) {
        hashTracker.push(transactionHash);
        const transactionPayload = {
          jsonrpc: "2.0",
          id: id++,
          method: "eth_getTransactionByHash",
          params: [ethMessage?.params?.result?.transactionHash],
        };
        ws.send(JSON.stringify(transactionPayload));
      }
    } else if (typeof ethMessage.result === 'object') {
      const transaction = ethMessage.result
      const convertedTransaction = convertNumericProps(transaction)

      const destinations = await getDestinationsForTransaction(convertedTransaction);
      console.log(destinations)
      notificationQueue.write(JSON.stringify({ transaction, destinations }))
    }
  };

  ws.on("open", () => {
    ws.send(JSON.stringify(logSubscribePayload));
  });

  ws.on("message", handleMessage);

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
