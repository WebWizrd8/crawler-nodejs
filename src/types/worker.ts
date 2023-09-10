export interface IWorkerData {
  chainId: number,
  endpoint: string;
}

export enum WorkerMessage {
  Exit = "Exit",
  Test = "Test",
}

export enum EthMessageMethod {
  Subscription = "eth_subscription"
}

interface IEthMessageParamsResult {
  address: string,
  topics: string[],
  data: string,
  blockNumber: string,
  transactionHash: string,
  transactionIndex: string,
  blockHash: string,
  logIndex: string,
  removed: boolean,
}

interface IEthMessageParams {
  subscription: string,
  result: IEthMessageParamsResult,
}

export interface IEthMessage {
  method: EthMessageMethod,
  params: IEthMessageParams,
}