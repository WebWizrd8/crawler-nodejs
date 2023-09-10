export interface IWorkerData {
  chainId: number,
  endpoint: string;
}

export enum WorkerMessage {
  Exit = "Exit",
  Test = "Test",
}
