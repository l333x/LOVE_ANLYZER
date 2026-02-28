import { useState } from 'react';

const TERMS = [
    {
        term: 'Gaslighting',
        emoji: '🌪️',
        type: '🚩 Red Flag',
        tldr: 'Te hacen dudar de tu propia realidad.',
        def: 'Técnica de manipulación psicológica donde el abusador distorsiona la realidad para que la víctima dude de su percepción, memoria o cordura. Frases típicas: "Eso nunca pasó", "Estás exagerando", "Estás loca/o".',
        example: '"¿Cuándo yo dije eso? Tú siempre inventas cosas. Creo que necesitas ayuda."',
    },
    {
        term: 'Love Bombing',
        emoji: '💣',
        type: '🚩 Red Flag',
        tldr: 'Exceso de amor para crear dependencia.',
        def: 'Fase inicial de una relación tóxica donde la persona bombardea con atención excesiva, regalos y declaraciones de amor para crear una dependencia emocional rápida.',
        example: '"Eres la persona más increíble que he conocido. No puedo vivir sin ti. Quiero que nos mudemos juntos ya."',
    },
    {
        term: 'Ghosting',
        emoji: '👻',
        type: '🟨 Yellow Flag',
        tldr: 'Desaparecer sin dar explicaciones.',
        def: 'Cortar toda comunicación de forma abrupta y sin previo aviso. La persona simplemente deja de responder y desaparece.',
        example: '(Última conexión: hace 3 semanas. Mensajes leídos, sin respuesta.)',
    },
    {
        term: 'Breadcrumbing',
        emoji: '🍞',
        type: '🟨 Yellow Flag',
        tldr: 'Migajas de atención para mantenerte enganchado/a.',
        def: 'Enviar señales mínimas de interés (un like, un emoji, un "hola" cada tanto) para mantener a la persona interesada sin comprometerse.',
        example: '"Heyy 👋" (después de 2 meses sin hablar, y luego no responde de nuevo).',
    },
    {
        term: 'Stonewalling',
        emoji: '🧱',
        type: '🚩 Red Flag',
        tldr: 'Muro de silencio como castigo.',
        def: 'Negarse a comunicarse, ignorar deliberadamente o dar la "ley del hielo" como forma de castigo o control emocional.',
        example: '"..." (silencio absoluto durante días después de una discusión).',
    },
    {
        term: 'Triangulación',
        emoji: '🔺',
        type: '🚩 Red Flag',
        tldr: 'Meter a un tercero para generar celos.',
        def: 'Involucrar a una tercera persona (ex, amigo/a, desconocido/a) en la dinámica para generar celos, inseguridad o competencia.',
        example: '"Mi ex me escribió y dice que me extraña mucho. Qué loco, ¿no?"',
    },
    {
        term: 'Hoovering',
        emoji: '🌀',
        type: '🚩 Red Flag',
        tldr: 'Intentar "aspirarte" de vuelta a la relación.',
        def: 'Cuando un ex o persona tóxica intenta volver a tu vida después de un distanciamiento, usando promesas, nostalgia o manipulación.',
        example: '"He cambiado. No soy el mismo de antes. Te necesito. Dame otra oportunidad."',
    },
    {
        term: 'Comunicación Asertiva',
        emoji: '💚',
        type: '🟩 Green Flag',
        tldr: 'Expresión clara y respetuosa.',
        def: 'Forma de comunicación donde la persona expresa sus necesidades, sentimientos y límites de manera directa, honesta y respetuosa, sin agresividad ni pasividad.',
        example: '"Me sentí triste cuando cancelaste sin avisar. Me gustaría que me avisaras con tiempo."',
    },
    {
        term: 'Escucha Activa',
        emoji: '👂',
        type: '🟩 Green Flag',
        tldr: 'Escuchar de verdad, no solo oír.',
        def: 'Prestar atención genuina a lo que la otra persona dice, reflejando comprensión y validando sus emociones antes de responder.',
        example: '"Entiendo lo que sientes. Tiene sentido que te moleste eso. ¿Qué puedo hacer para que estés más cómoda?"',
    },
    {
        term: 'Future Faking',
        emoji: '🔮',
        type: '🚩 Red Flag',
        tldr: 'Prometer un futuro que nunca llega.',
        def: 'Hacer promesas grandiosas sobre el futuro de la relación (viajes, mudarse juntos, matrimonio) para mantener enganchada a la persona, sin intención real de cumplirlas.',
        example: '"El próximo mes nos vamos a la playa. Y en diciembre viajamos a Europa. Ya vas a ver, todo va a cambiar."',
    },
];

export default function GlossaryPage() {
    const [expanded, setExpanded] = useState(null);

    return (
        <div className="page-enter relative">
            {/* Orb */}
            <div className="orb w-[400px] h-[400px] bg-pink-500 top-[10%] left-[-10%]" style={{ position: 'absolute' }} />

            <section className="px-5 sm:px-8 pt-16 pb-8 text-center max-w-4xl mx-auto relative z-10">
                <h1 className="text-huge font-sans-heavy font-black text-white animate-card">
                    Glosario <span className="font-serif-it normal-case" style={{ color: 'var(--pink)' }}>Tóxico</span>
                </h1>
                <p className="text-white/40 mt-4 max-w-md mx-auto animate-card stagger-1 text-base">
                    El diccionario definitivo de banderas rojas, amarillas y verdes. Aprende a identificar cada patrón.
                </p>
            </section>

            <section className="px-5 sm:px-8 pb-20 max-w-4xl mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TERMS.map((t, i) => (
                        <div
                            key={t.term}
                            className={`glossary-card animate-card ${expanded === i ? 'expanded sm:col-span-2' : ''}`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                            onClick={() => setExpanded(expanded === i ? null : i)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{t.emoji}</span>
                                    <div>
                                        <h3 className="font-sans-heavy font-bold text-white tracking-tight text-lg">{t.term}</h3>
                                        <span className="text-xs text-white/30">{t.type}</span>
                                    </div>
                                </div>
                                <span className={`text-white/20 text-xl transition-transform duration-300 ${expanded === i ? 'rotate-45' : ''}`}>+</span>
                            </div>

                            <p className="text-white/50 text-sm mt-3">{t.tldr}</p>

                            {expanded === i && (
                                <div className="mt-4 pt-4 border-t border-white/[0.06] animate-fade space-y-3">
                                    <p className="text-white/40 text-sm leading-relaxed">{t.def}</p>
                                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                        <p className="text-xs text-white/25 mb-1 font-sans-heavy font-semibold uppercase tracking-wider">Ejemplo real:</p>
                                        <p className="text-white/50 text-sm italic">"{t.example}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
