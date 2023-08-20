import React, { useEffect, useRef, useState } from 'react';
import { numerosDisp } from './utils/data';
import klever from './providers/klever';

import './App.css';
import hospital from '../img/ha.png';
import falcoes from '../img/falcoes.png';
import magalu from '../img/magalu.png';
import premiere from '../img/premiere.png';
import kleverLogo from '../img/klever.png';
import vagalume from '../img/vagalume.png';

const App: React.FC = () => {
  const [error, setError] = useState('');
  const [kleverConnected, setKleverConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<number>();
  const toRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const amountRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [txHash, setTxHash] = useState<string | undefined>();
  const [instituicao, setInstituicao] = useState<string>();
  const [premio, setPremio] = useState<string>();
  const [aposta, setAposta] = useState<string>();
  const [changeClass, setChangeClass] = useState<string>();

  const [rifaSize, setRifaSize] = useState<number[]>();

  useEffect(() => {
    const watcher = setInterval(() => {
      if (!window.tronWeb || !window.tronWeb.ready) {
        return;
      }

      if (window.tronWeb.defaultAddress.base58) {
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

  const connectedStyle = (provider: boolean) => {
    return { backgroundColor: provider ? 'green' : '#1a1a1a' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountRef?.current?.value) * 1000000;
    if (!aposta) {
      alert('Selecione um número para ser sorteado');
    }
    if (instituicao && amount) {
      const data = await klever.send(instituicao, amount);
      setTxHash(JSON.stringify(data));
    } 
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setInstituicao(target.value);
  }

  const onInputPremioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setPremio(target.value);
  }


  const onClickNumber = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    (event.target as Element).classList.add('selected')
    setAposta((index+1).toString());
  }

  return (
    <section>
      <h1>Ajude uma causa e concorra a um prêmio!</h1>
      <div className="flex space-around">
        <div className="container">
          <h2>Conecte sua carteira digital </h2>
          <div className="flex items-center space-around">
            <button
              style={connectedStyle(kleverConnected)}
              onClick={connectToKlever}
            >
              KleverWeb
            </button>
          </div>

          {error && <p onClick={() => setError('')}>{error}</p>}

        </div>

        <div className="container2">

          <div className="text">
            <h2>Conta:</h2>
            <b>{address}</b>
          </div>
          <div>
            <h2>Saldo:</h2> 
            KLV {balance}
          </div>
        </div>

        <hr />

        {
        <div className="container3">
          <h2>Doe e Concorra</h2>
          <form onSubmit={handleSubmit}>
            <div className="instituicao">

              <h3>Escolha uma instituição:</h3>
              <label>
                <input
                required name="instituicao"
                type="radio"
                value="klv1ps54eeezs0gt6xdjd452uad022pdztrtlx2nmqq64r7q8j6nsass8540jx"
                onChange={onInputChange}
                ref={toRef} /><a href="https://gerandofalcoes.com/" target="_blank">Gerando Falcões </a>
                <img src={falcoes} className='inputInstituicao'/>
              </label>

              <label>
                <input
                required name="instituicao"
                type="radio"
                value="klv1ad90sxgxtp9c7hupn67c90k0nw6kl76ff0qzfqt0ng300yv5pfms8frxem"
                onChange={onInputChange}
                ref={toRef} /><a href="https://hospitaldeamor.com.br/" target="_blank">Hospital do Câncer</a>
                <img src={hospital} className='inputInstituicao'/>
              </label>

              <label>
                <input
                required name="instituicao"
                type="radio"
                value="klv1efnz0q2fm5g8zrx0gyzu3y7va9xs5447mfqvy9xlt2qwmcpmduvqelj4kn"
                onChange={onInputChange}
                ref={toRef} /><a href="https://www.vagalume.org.br/" target="_blank">Associação VagaLume</a>
                <img src={vagalume} className='inputInstituicao'/>
              </label>
            </div>

            <div className="Premios">
              <h3>Escolha qual dos prêmios você quer concorrer: </h3>
              <label >
                <input required name="premio" type="radio" value="R$ 100,00 no Magazine Luiza" onChange={onInputPremioChange} />
                R$ 100,00 no Magazine Luiza
                <img src={magalu} className='inputInstituicao'/>
              </label>
              <label>
                <input required name="premio" type="radio" value="R$ 50,00 na sua conta da Klever" onChange={onInputPremioChange} />
                R$ 50,00 na sua conta da Klever
                <img src={kleverLogo} className='inputInstituicao'/>
              </label>
              <label>
                <input required name="premio" type="radio" value="1 ano gratis de Canal de Futebol" onChange={onInputPremioChange} />
                1 ano gratis de Canal de Futebol
                <img src={premiere} className='inputInstituicao'/>
              </label>
            </div>
            
            <div className="valor">
              <label><h3>Valor a ser doado:</h3></label>
              <input required type="number" name="amount" ref={amountRef} />
            </div>
            <hr />
            <h2>Escolha um número: </h2>
            <div className="tableRifa">
              {numerosDisp.map((num, index) => (
                <button
                  key={index}
                  className='divNumbers'
                  onClick={(event) => onClickNumber(event, index)}>
                  {num}
                </button>))
              }
            </div>
            <hr />
            <button className="btn-submit" type="submit">
              Submit
            </button>
          </form>

          {txHash && (
            <div>
              <br />
              <p className="text">
              <h1>Transação concluída com sucesso</h1>
              <p>{`Você está concorrendo a ${ premio } com o número ${ aposta }`}</p>
              <h2>Boa sorte!</h2>
              </p>
            </div>
          )}

        </div>}
      </div>
    </section>
  );
};

export default App;
