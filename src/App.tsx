import React, { useEffect, useRef, useState } from 'react';
import './App.css';
// import ethereum from './providers/ethereum';
import klever from './providers/klever';
const numerosDisp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];


const App: React.FC = () => {
  const [error, setError] = useState('');
  const [kleverConnected, setKleverConnected] = useState(false);
/*   const [tronConnected, setTronConnected] = useState(false);
  const [ethConnected, setEthConnected] = useState(false); */
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<number>();
  const toRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const amountRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [txHash, setTxHash] = useState<string | undefined>();
  const [instituicao, setInstituicao] = useState<string >();
  const [rifaSize, setRifaSize] = useState<number[]>();

  useEffect(() => {
    const watcher = setInterval(() => {
      if (!window.tronWeb || !window.tronWeb.ready) {
        return;
      }

      if (window.tronWeb.defaultAddress.base58) {
        // setTronConnected(true);
        clearInterval(watcher);
      }
    }, 500);

    return () => {
      clearInterval(watcher);
    };
  }, []);

  const fetchBalance = async () => {
    const amount = await klever.balance();
    const currencyNormalizeMultiplier = Math.pow(10, 6);

    setBalance(amount / currencyNormalizeMultiplier);
  };

  const connectToKlever = async () => {
    const address = await klever.connectWithSdk();
    if (!address.startsWith('klv')) {
      setError(address);
    }

    setKleverConnected(true);
    setAddress(klever.address);
    await fetchBalance();
  };

  /* const connectToEth = async () => {
    const address = await ethereum.connect();
    if (!address.startsWith('0x')) {
      setError(address);
    }

    setEthConnected(true);
  }; */

  const connectedStyle = (provider: boolean) => {
    return { backgroundColor: provider ? 'green' : '#1a1a1a' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const instituicao = toRef?.current?.value;
    const amount = amountRef?.current?.value;
    
    if (instituicao && amount) {
      console.log({ instituicao, amount });
      const data = await klever.send(instituicao, parseInt(amount));
      console.log(data);
      setTxHash(JSON.stringify(data));
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const { target } = event;
    setInstituicao(target.name);
  }

  return (
    <div>
      <h1>Ajude uma causa e concorra um premio</h1>
      <div className="flex space-around">
        <div className="container">
          <h2>Conecte sua Wallet</h2>
          <div className="flex items-center space-around">
            <button
              style={connectedStyle(kleverConnected)}
              onClick={connectToKlever}
            >
              KleverWeb
            </button>
            {/* <button style={connectedStyle(tronConnected)}>TronWeb</button>
            <button style={connectedStyle(ethConnected)} onClick={connectToEth}>
              Web3
            </button> */}
          </div>
          {error && <p onClick={() => setError('')}>{error}</p>}
        </div>

        <div className="container">
          <h2>Conta:</h2>
          <p className="text">
            <b>{address}</b>
          </p>
          <p>
            <b>Saldo:</b> KLV {balance}
          </p>
        </div>

        <div className="container">
          <h2>Doação</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Para:</label>              
              <label> Instituição 1
              <input type="radio" name="klv1ps54eeezs0gt6xdjd452uad022pdztrtlx2nmqq64r7q8j6nsass8540jx" onChange={onInputChange} ref={toRef} />
              </label>
              <label> Instituição 2
                <input type="radio" name="klv1ad90sxgxtp9c7hupn67c90k0nw6kl76ff0qzfqt0ng300yv5pfms8frxem" onChange={onInputChange} ref={toRef} />
              </label>
              <label> Instituição 3
                <input type="radio" name="klv1efnz0q2fm5g8zrx0gyzu3y7va9xs5447mfqvy9xlt2qwmcpmduvqelj4kn" onChange={onInputChange} ref={toRef} />
              </label>
            </div>
            <br />
            <div>
              <label>Valor:</label>
              <input required type="number" name="amount" ref={amountRef} />
            </div>
            <br />
            <div className="tableRifa"> 
            {numerosDisp.map((num) => <div className='divNumbers'>{num}</div>)}
            </div>

            <button className="btn-submit" type="submit">
              Submit
            </button>
          </form>
          {txHash && (
            <div>
              <br />
              <p className="text">
                <code>{txHash}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
