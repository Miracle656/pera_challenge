import { useState, useCallback } from 'react'
import algosdk, { waitForConfirmation } from 'algosdk'
import { useAppContext } from '../../AppProvider'

function TransactionPay() {

  const { peraWallet, accountAddress, chainet } = useAppContext()
  
  const algoserver = chainet == 416002 ? 'https://testnet-api.algonode.cloud' : 'https://mainnet-api.algonode.cloud'

  const algod = new algosdk.Algodv2("", algoserver)
  
  

  const [receiverAddress, setReceiverAddress] = useState<string>('6PLHRYYTROJWDL7NOYKD3TDAAZM2WLVYH4ADT5CEHDQBRVYP2NJVDJDCZ4')

  // const [exreceiverAddress, setExReceiverAddress] = useState("")
  //@ts-ignore
  const [algoamt, setAlgoAmt] = useState<any>(1e6)
  const [isLoading, setIsLoading] = useState(false)

  const generatePaymentTxns = async ({
    //@ts-ignore
    to,
    initiatorAddr
  }: {
    to: string;
    initiatorAddr: string;
  }) => {
    const suggestedParams = await algod.getTransactionParams().do()
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: initiatorAddr,
      receiver: receiverAddress,
      amount: 1e6,
      suggestedParams
    });

    return [{ txn, signers: [initiatorAddr] }]
  }
  
  const generatePaymentTxns2 = async ({
    //@ts-ignore
    to,
    initiatorAddr
  }: {
    to: string;
    initiatorAddr: string;
  }) => {
    const suggestedParams = await algod.getTransactionParams().do()
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: initiatorAddr,
      receiver: receiverAddress,
      amount: BigInt(algoamt),
      suggestedParams
    });

    return [{ txn, signers: [initiatorAddr] }]
  }

  const donateOneAlgo = useCallback(async () => {
    if (!accountAddress) {
      alert("Ensure Wallet is connected")
      return
    }
    
    setIsLoading(true)
    console.log(accountAddress)
    const txGroups = await generatePaymentTxns({
      to: receiverAddress,
      initiatorAddr: accountAddress
    });

    try {
      const signedTxnGroup = await peraWallet.signTransaction([txGroups])
      const { txid } = await algod.sendRawTransaction(signedTxnGroup).do()
      
      const result = await waitForConfirmation(algod, txid, 3)

      console.log(result)
      alert("Donation Succesfull")
    } catch (error) {
      console.error("Couldn't sign payment txns", error)
      alert("Couldn't sign payment txns")
    }finally{
    setIsLoading(false)
    }
  }, [accountAddress])
  
  const sendAlgo = useCallback(async () => {
    if (!accountAddress) {
      alert("Ensure Wallet is connected")
      return
    }
    
    //setIsLoading(true)
    console.log(accountAddress)
    const txGroups = await generatePaymentTxns2({
      to: receiverAddress,
      initiatorAddr: accountAddress
    });

    try {
      const signedTxnGroup = await peraWallet.signTransaction([txGroups])
      const { txid } = await algod.sendRawTransaction(signedTxnGroup).do()
      
      const result = await waitForConfirmation(algod, txid, 3)

      console.log(result)
      alert("Trabsaction Succesfull")
      
    } catch (error) {
      console.error("Couldn't sign payment txns", error)
      alert("Couldn't sign payment txns")
    } finally{
    setIsLoading(false)
    }
  }, [accountAddress])

  return (
    <div>
      <button disabled={isLoading} onClick={donateOneAlgo}>{isLoading ? 'Processing...': 'Donate 1 ALGO'}</button>
      
      <div className="mt-5 flex justify-center items-center gap-5 flex-col md:flex-row">
      <label>Send 1 ALGO to someone else: </label>
      <input onChange={(e)=> setReceiverAddress(e.target.value) } value={receiverAddress} className="border border-black p-1 pl-3 rounded-lg outline-none w-full" type="text" placeholder="paste receipient address" />
      {/*<input onChange={(e)=> setAlgoAmt(e.target.value) } value={algoamt} className="border border-black p-1 pl-3 rounded-lg outline-none w-20" type="text" placeholder="amt" />*/}
      <button disabled={isLoading} onClick={sendAlgo}>Send</button>
      </div>
    </div>
  )
}

export default TransactionPay
