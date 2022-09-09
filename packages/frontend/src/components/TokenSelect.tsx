import AppContext from './appContext';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useEthers } from '@usedapp/core';
import { globalState } from '.';
import { useAppContext } from './appContext';

export default function TokenSelect() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>('Select a token');
  const [search, setSearch] = useState<any>('');
  const { chainId, library } = useEthers();
  const { setToken } = useAppContext();
  // const signer = library!.getSigner();
  useEffect(() => {
    Axios.get(`https://tokens.uniswap.org/`).then((res) => {
      setTokens(res.data.tokens);
    });
  }, []);
  function toggleFunc() {
    const element = document.getElementById(
      'myDropdown'
    ) as HTMLDivElement | null;
    element!.classList.toggle('show');
  }

  function onOptionSelect(value: any) {
    setSelected(value.symbol);
    const element = document.getElementById(
      'myDropdown'
    ) as HTMLDivElement | null;
    element!.classList.toggle('show');
  }

  return (
    <>
      <div className="dropdown">
        <button onClick={() => toggleFunc()} className="dropbtn">
          {selected}
        </button>
        <div id="myDropdown" className="dropdown-content">
          <input
            type="text"
            placeholder="Search.."
            id="myInput"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {tokens
            .filter((val) => {
              return val.symbol.toLowerCase().includes(search.toLowerCase());
            })
            .map((val, index) => {
              return (
                <div
                  onClick={function (e) {
                    onOptionSelect(val);
                    setToken(val);
                  }}
                  key={index}
                  className="optionContainer"
                >
                  {val.logoURI && (
                    <img className="imageContainer" src={val.logoURI} alt="" />
                  )}
                  <a>{val.symbol}</a>
                  (chain ID:{val.chainId})
                </div>
              );
            })
            .slice(0, 10)}
        </div>
      </div>
    </>
  );
}
