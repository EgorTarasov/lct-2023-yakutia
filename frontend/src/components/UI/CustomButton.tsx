import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  colorType?: 'primary' | 'secondary' | 'outline';
};

export const CustomButton = ({ children, onClick, type, colorType = "primary" }: Props) => {
  const buttonClasses = clsx(
    "py-4 px-3 rounded-input w-full min-h-fit flex justify-center items-center",
    {
      "bg-white text-primary-900": colorType === "secondary",
      "bg-white text-primary-900 border border-2 border-primary-900": colorType === "outline",
      "bg-primary-900 text-white": colorType === "primary",
    }
  );

  return (
    <button onClick={onClick} className={buttonClasses} type={type} >
      {children}
    </button>
  );
};

