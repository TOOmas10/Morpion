type PropsBoutonGomme = {
  texte: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  autoFocus?: boolean;
};

export default function BoutonGomme({
  texte,
  onClick,
  type = "button",
  disabled = false,
  autoFocus = false,
}: PropsBoutonGomme) {
  return (
    <button
      type={type}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={onClick}
      className="gomme flex h-10 -rotate-2 cursor-pointer overflow-hidden rounded-md shadow-md transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-fonce disabled:cursor-wait disabled:opacity-70"
    >
      <span className="w-7 shrink-0 bg-white sm:w-10" />
      <span className="flex items-center justify-center bg-[#4dabf7] px-4 text-lg font-semibold whitespace-nowrap text-white sm:px-6 sm:text-xl">
        {texte}
      </span>
    </button>
  );
}
