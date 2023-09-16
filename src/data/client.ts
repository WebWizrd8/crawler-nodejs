// import fetch from "node-fetch";
import { DB_URL } from "../constants/env";
import { IChain, IChainEndpoint } from "../types/types";

export const getChains = async (): Promise<IChain[]> =>
  (await fetch(DB_URL + "chains")).json();

export const getChain = async (id: IChain["id"]): Promise<IChain> =>
  (await fetch(DB_URL + "chains?id=eq." + id)).json();

export const getChainEndpoints = async (
  chainId: IChain["id"],
): Promise<IChainEndpoint[]> =>
  (await fetch(DB_URL + "chains_endpoints?chain_id=eq." + chainId)).json();