type StatCard = {
  label: string;
  value: string | number;
  hint: string;
};

export function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="glass rounded-[1.5rem] p-5">
          <p className="text-sm text-muted">{stat.label}</p>
          <p className="mt-3 font-display text-4xl text-navy">{stat.value}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{stat.hint}</p>
        </article>
      ))}
    </div>
  );
}
