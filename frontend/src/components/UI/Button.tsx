import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export const Button = ({ children, onClick, type }: Props) => {
  return (
    <button onClick={onClick} className='py-3 bg-primary-900 text-white rounded-input w-full' type={type} >
      {children}
    </button>
  );
};

