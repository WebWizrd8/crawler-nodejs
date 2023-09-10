export const getLastTransactionsStorage = (size: number) => {
  const map = new Map();
  const keys: string[] = [];

  const push = (transactionHash: string) => {
    if (map.size >= size) {
      const oldestKey = keys.shift();
      map.delete(oldestKey);
    }
    map.set(transactionHash, true);
    keys.push(transactionHash);
  };

  const has = (transactionHash: string) => map.get(transactionHash);

  return { has, push };
};
