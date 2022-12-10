import React, { useEffect, useState } from 'react';

export default function Confirmation(instituicao: string, amount: number, premio: string, aposta: string) {
  return (
    <div >
      <h1>Transação concluída com sucesso</h1>
      <p>Sua doação para { instituicao } no valor de { amount } concorrendo a { premio } com o número { aposta } foi concluída com sucesso!</p>
      <h2>Boa sorte!</h2>
    </div>
  );
}
