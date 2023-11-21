// import fetch from "node-fetch";
import { DB_URL } from "../constants/env";
import { IAlert, IChain, IChainEndpoint, IDestination } from "../types/types";

export const getChains = async (): Promise<IChain[]> =>
  (await fetch(DB_URL + "chain")).json();

export const getChain = async (id: IChain["id"]): Promise<IChain> =>
  (await fetch(DB_URL + "chain?id=eq." + id)).json();

export const getChainEndpoints = async (
  chainId: IChain["id"],
): Promise<IChainEndpoint[]> =>
  (await fetch(DB_URL + "chain_endpoint?chain_id=eq." + chainId)).json();

export const getDestination = async (
  id: IDestination["id"],
): Promise<IDestination> =>
  (await fetch(DB_URL + "destination?id=eq." + id)).json();

export const getAlert = async (
  id: IAlert["id"],
): Promise<IAlert> =>
  (await fetch(DB_URL + "alert?id=eq." + id)).json();

export const getDestinationsForTransaction = async (event_data: Record<string, unknown>): Promise<IDestination[]> =>
  (await fetch(DB_URL + "rpc/get_destination_targets", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Prefer': "params=single-object"
    },
    body: JSON.stringify(event_data)
  }
  )).json();
