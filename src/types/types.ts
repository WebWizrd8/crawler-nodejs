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
  chain_id: IChain["id"];
  type: IChainEndpointType;
  url: string;
}

export interface IDestination {
  id: number;
  user_id: string;
  target: Record<string, unknown>;
}

export interface IAlert {
  id: number;
  user_id: string;
  chain_id: IChain["id"];
  destination_id: IDestination["id"];
  name: string;
}
