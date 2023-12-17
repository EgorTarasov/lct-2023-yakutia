import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  rounded?: string;
}

export const Wrapper = ({ children, rounded }: Props) => {
  const wrapperClasses = clsx(
    "w-full relative overflow-hidden",
    {
      "rounded-b-block": rounded === "bottom",
      "rounded-block": rounded === "full",
    }
  );

  return (
    <section className={wrapperClasses}>
      <div className="text-left py-10 md:py-[70px]">
        {children}
      </div>
    </section>
  );
};
