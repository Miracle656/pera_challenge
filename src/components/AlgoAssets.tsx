import axios from 'axios'
import { useState, useEffect } from 'react'
import pictemp from '../assets/pictemp.jpg'
import { useAppContext } from '../../AppProvider'
import algosdk, { waitForConfirmation } from 'algosdk'
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels'

function AlgoAssets() {
  //@ts-ignore
  const [algoserver, setAlgoServer] = useState('https://mainnet-api.algonode.cloud') //https://testnet-api.algonode.cloud

  const algod = new algosdk.Algodv2("", algoserver)

  const [assets, setAssets] = useState([])
  const { accountAddress, peraWallet } = useAppContext()
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {

    axios.get('https://mainnet.api.perawallet.app/v1/public/assets/?filter=is_verified')
      .then(response => {
        setAssets(response.data.results)
        console.log(response.data.results)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }, [])

  async function generateOptIntoAssetTxns({
    assetID,
    initiatorAddr
  }: {
    assetID: number;
    initiatorAddr: string;
  }): Promise<SignerTransaction[]> {
    const suggestedParams = await algod.getTransactionParams().do();
    const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: initiatorAddr,
      receiver: initiatorAddr,
      assetIndex: assetID,
      amount: 0,
      suggestedParams
    });

    return [{ txn: optInTxn, signers: [initiatorAddr] }];
  }

  if (loading) return <p>Loading verified assets...</p>

  return (
    <div>
      <h1 className="mb-3 mt-3">Verified Assets</h1>
      <div className='flex justify-center items-center gap-20 flex-wrap'>
        {assets.map((item: any) => (
          <div onClick={async () => {
          console.log(typeof(item.asset_id))
            const txGroups = await generateOptIntoAssetTxns({
              assetID: item.asset_id,
              initiatorAddr: accountAddress!
            });

            try {
              const signedTxnGroup = await peraWallet.signTransaction([txGroups])
      const { txid } = await algod.sendRawTransaction(signedTxnGroup).do()
      
      const result = await waitForConfirmation(algod, txid, 3)

      console.log(result)
      alert("opt in successfull")
            } catch (error) {
              console.log("Couldn't sign Opt-in txns", error);
            }
          }} key={item.asset_id} className='flex justify-center items-center gap-20 border border-grey p-3 rounded-lg cursor-pointer hover:scale-105 transition transform duration-100 ease-in-out'>
            <img className='w-20' src={item.logo || pictemp} alt="" />
            <div className='flex justify-center items-center flex-col'>
              <p>{item.name}</p>
              <p>{item.asset_id}</p>
              <p>{item.verification_tier}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlgoAssets
