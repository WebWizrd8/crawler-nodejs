export interface IChain {
  id: number;
  name: string;
}

enum IChainEndpointType {
  WS = "WS",
  WSS = "WSS",
}

export interface IChainEndpoint {
  id: number;
  chainId: IChain["id"];
  type: IChainEndpointType;
  url: string;
}
