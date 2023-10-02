const propsToConvert = ['gas', 'gasPrice', 'maxFeePerGas', 'maxPriorityFeePerGas']

export const convertNumericProps = (transaction: Record<string, string>) => 
  Object.entries(transaction).reduce((convertedTransaction, [key, value]) => {
    convertedTransaction[key] = propsToConvert.includes(key) ? parseInt(value, 16) : value
    return convertedTransaction
  }, {} as Record<string, string | number>)
