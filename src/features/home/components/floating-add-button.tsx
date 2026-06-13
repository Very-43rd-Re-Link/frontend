export function FloatingAddButton() {
  return (
    <button
      type="button"
      aria-label="추가"
      className="absolute bottom-[76px] right-[27px] flex h-14 w-14 items-center justify-center rounded-full bg-relink-lavender-intense"
    >
      <span className="text-[48px] font-semibold leading-[54px] text-relink-white">+</span>
    </button>
  );
}
