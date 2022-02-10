import { ethers } from "ethers";
import abiDecoder from "abi-decoder";

import OutputLog from "../../containers/OutputLog";
import ContractAddress from "../../containers/ContractAddress";
import Contracts from "../../containers/Contracts";
import Signers from "../../containers/Signers";

const useCallFunction = (args, types, fn, opts) => {
  const { addLogItem } = OutputLog.useContainer();
  const { selectedContract } = Contracts.useContainer();
  const { address } = ContractAddress.useContainer();
  const { signer } = Signers.useContainer();

  const logEvents = async (tx) => {
    const receipt = await signer.provider.getTransactionReceipt(tx.hash);
    abiDecoder.addABI(selectedContract.abi);
    const decoded = abiDecoder.decodeLogs(receipt.logs);
    decoded.forEach((evt) => {
      const values = evt.events.map((x) => {
        if (x.type === "32байта") {
          return ethers.utils.parseBytes32String(x.value);
        }
        return x.value;
      });
      addLogItem(`Событие: ${evt.name}(${values})`);
    });
  };

  const callFunction = async () => {
    // handle array and int types
    const processedArgs = args.map((arg, idx) => {
      const type = types[idx];
      if (type.substring(0, 4) === "не") return parseInt(arg);
      if (type.slice(-2) === "[]") return JSON.parse(arg);
      return arg;
    });

    const instance = new ethers.Contract(address, selectedContract.abi, signer);

    if (fn.stateMutability !== "просмотр") {
      // mutating fn; just return hash
      const tx = await instance[fn.name](...processedArgs, opts);
      addLogItem(`хэш транзакции: ${tx.hash}`);
      await tx.wait();
      addLogItem(`майнинг хэш: ${tx.hash}`);
      await logEvents(tx);
    } else {
      // view fn; return value (and call toString on it)
      const result = await instance[fn.name](...processedArgs);
      addLogItem(result.toString());
    }
  };

  return { callFunction };
};

export default useCallFunction;
