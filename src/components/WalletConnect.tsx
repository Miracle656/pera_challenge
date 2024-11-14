import {useAppContext} from '../../AppProvider'
import { useEffect } from 'react';


// import { AlgorandChainIDs } from '@perawallet/connect/dist/util/peraWalletTypes';

// interface PeraWalletConnectOptions {
//     shouldShowSignTxnToast?: boolean;
//     chainId?: AlgorandChainIDs
// }

function WalletConnect() {

    const { accountAddress, setAccountAddress, chainet, setChainNet, peraWallet } = useAppContext()
    
    // const [allAddress, setAllAddress] = useState([])

    useEffect(() => {
        peraWallet.reconnectSession().then((accounts) => {
            peraWallet.connector?.on("disconnect", handleDisconnectWalllet)

            if(peraWallet.isConnected && accounts.length){
                setAccountAddress(accounts[0])
                // setAllAddress(accounts)
            }
        })
    })

    // type AlgorandChainIDs = 416001 | 416002

    // const[network, setNetwork] = useState<String>("Mainnet")


    const isConnectedToPeraWallet = !!accountAddress;

    const handleDisconnectWalllet = () => {
        peraWallet.disconnect();
        setAccountAddress("")
        setChainNet("")

    }

    const handleConnectWallet = async () => {
        try {
            await
                peraWallet
                    .connect()
                    .then((newAccounts) => {
                        peraWallet.connector?.on('disconnect', handleConnectWallet)

                        setAccountAddress(newAccounts[0])
                        // setAllAddress(newAccounts)
                        console.log(newAccounts)
                        setChainNet(peraWallet.chainId)
                    })

        } catch (error: any) {
            if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                console.error(error)
            }
        }
    }
    
    // const handleSelectAddress = (address) =>{
    //     setAccountAddress(address)
    // }

    const switchChain = () => {
        if(chainet == 416001){
            setChainNet(416002)
        }else{
            setChainNet(416001)
        }
    }


    return (
        <div>
            <div className='flex justify-center items-center'>
                <button onClick={
                    isConnectedToPeraWallet ? handleDisconnectWalllet : handleConnectWallet
                }>{isConnectedToPeraWallet ? "Disconnect" : "Connect with Pera"}</button>

                <div className='pl-5'>
                    { accountAddress && (
                    <button>{`${accountAddress?.slice(0, 6)}...${accountAddress?.slice(-4)}`}</button>
                    )}
                </div>
            </div>
            
            {/* <div className="mt-3">
                <select className="p-3" onChange={(e) => handleSelectAddress(e.target.value)}>
                {allAddress.map((address) => (
                <option key={address} value={address}>
                    {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </option>
            ))}
            </select>
            </div> */}

            <div className='p-5'>
                <button onClick={() => switchChain()}>Network: {chainet == 416001 ? "Mainnet" : "Testnet"} : {chainet}</button>
                <p>click to switch network</p>
            </div>

            {/* <div>Balance: {}</div> */}
        </div>
    )
}

export default WalletConnect
