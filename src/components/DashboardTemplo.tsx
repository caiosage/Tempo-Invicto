import { IndicadorRito } from './IndicadorRito';
import { RitualDeRetorno } from './RitualDeRetorno';
import { useTemploStore } from '../store/useTemploStore';

export function DashboardTemplo() {
  const ritos = useTemploStore((estado) => estado.ritos);
  const registrarQueda = useTemploStore((estado) => estado.registrarQueda);

  const totalDiasInvictos = ritos.reduce((acumulador, rito) => acumulador + rito.diasInvictos, 0);
  const totalOuroPreservado = ritos.reduce((acumulador, rito) => acumulador + rito.ouroPreservado, 0);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 marble-overlay">
      <header className="mb-8 border-b border-bronze/20 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze">Tempus Invictus</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-100">O Templo</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-300">
          Um espaço de autogoverno: observe a si, mantenha os ritos vivos e transforme cada queda em
          precisão interior.
        </p>
      </header>

      <section className="mb-7 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Dias Invictos Totais</p>
          <p className="mt-2 font-serif text-3xl text-gold">{totalDiasInvictos}</p>
        </div>
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Ouro Preservado Total</p>
          <p className="mt-2 font-serif text-3xl text-gold">{totalOuroPreservado} min</p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {ritos.map((rito) => (
          <IndicadorRito key={rito.id} rito={rito} aoRegistrarQueda={registrarQueda} />
        ))}
      </section>

      <section className="mt-8">
        <RitualDeRetorno />
      </section>
    </main>
  );
}
