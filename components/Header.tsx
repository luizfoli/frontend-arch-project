import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

type HomeProps = {
    setAccessToken(accessToken: string) : void
};

const Header: NextPage = () => {

    const doLogout = () => localStorage.clear();

    const [name, setName] = useState("");
    useEffect(() => {
        if(typeof window != undefined) {
          const name = localStorage.getItem("name");
          if(name) {
            const fullName = name.split(" ");
            if(fullName && fullName.length > 0) {
                setName(fullName[0]);
            }
          }
        }
      }, []);

  return (
    <div className="container-header">
      <img src="/logo.svg" alt="Logo Fiap" className="logo" />
      <button>+ Adicionar Tarefa</button>
      <div className="mobile">
          <span>Hello, {name}</span>
          <img  src="/exit-mobile.svg" alt="Sair" />
      </div>
      <div className="desktop">
          <span>Hello, {name}</span>
          <img src="/exit-desktop.svg" alt="Sair" />
      </div>
</div>
  )
}

export default Header


