type House = {
  id: string;
  title: string;
  area: string;
  price: string;
  distance: string;
  img: string;
};

export default function HousingItem({ house }: { house: House }) {
  return (
    <article className="flex gap-4 border-b border-slate-100 p-4 last:border-none">
      <img
        src={house.img}
        alt=""
        className="h-24 w-24 flex-none rounded-2xl object-cover shadow-sm"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800">{house.title}</h3>
        <p className="mt-1 text-xs text-slate-500">{house.area} · {house.price}</p>
        <p className="mt-1 text-xs text-slate-400">{house.distance} to transit</p>
        <div className="mt-3 flex gap-2 text-xs font-semibold">
          <button className="rounded-full bg-primary-600 px-3 py-1 text-white shadow-sm">
            Contact
          </button>
          <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-600">
            Save
          </button>
        </div>
      </div>
    </article>
  );
}
