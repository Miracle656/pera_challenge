import pera from './assets/pera.png'
import WalletConnect from './components/WalletConnect'
import TransactionPay from './components/TransactionPay'
import AlgoAssets from './components/AlgoAssets'
import './App.css'



function App() {

  return (
    <>
      <div className='flex justify-center items-center flex-col md:flex-row mb-5'>
        <a href="https://docs.perawallet.app/references/pera-connect" target="_blank">
          <img src={pera} className="logo" alt="pera logo" />
        </a>
        <h1>Pera Challenge</h1>
      </div>
      <WalletConnect />
      <TransactionPay />
      <AlgoAssets />
    </>
  )
}

export default App
