import { Card } from '../ui/Card';
import './TeamSponsorsSection.css';

interface TeamMember {
  name: string;
  role: string;
}

const TEAM: TeamMember[] = [
  { name: 'Jarlyson Arthur Rodrigues do Nascimento', role: 'Integrante' },
  { name: 'Sofia Maria Lopes Borges', role: 'Integrante' },
  { name: 'Eduardo César Paiva Alencar', role: 'Integrante' },
  { name: 'Bianca Brandão Pilé', role: 'Integrante' },
  { name: 'Marcos Emanuel da Silva Leal', role: 'Integrante' },
];

const ADVISOR: TeamMember = { name: 'Prof.ª Julienne Cavalcante', role: 'Orientadora' };

function initials(name: string) {
  const parts = name.replace(/^Prof\.ª\s*/, '').split(' ').filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}

export function TeamSponsorsSection() {
  return (
    <>
      <Card eyebrow="Mostra Científica SESI/FIEPI — Eixo temático: Automação" title="Equipe do projeto">
        <div className="team-grid">
          {TEAM.map((member) => (
            <div className="team-member" key={member.name}>
              <span className="team-member__avatar">{initials(member.name)}</span>
              <div>
                <p className="team-member__name">{member.name}</p>
                <p className="team-member__role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="team-advisor">
          <span className="team-member__avatar team-member__avatar--advisor">{initials(ADVISOR.name)}</span>
          <div>
            <p className="team-member__name">{ADVISOR.name}</p>
            <p className="team-member__role team-member__role--advisor">{ADVISOR.role}</p>
          </div>
        </div>
      </Card>

      <Card eyebrow="Apoio" title="Patrocinador">
        <a
          className="sponsor-card"
          href="https://www.instagram.com/naelsonsoares10/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="sponsor-card__logo">🚚</span>
          <div className="sponsor-card__info">
            <p className="sponsor-card__name">Naelson Fretes</p>
            <p className="sponsor-card__tagline">Transporte de cargas para todo o Brasil</p>
            <p className="sponsor-card__meta">Segurança · Agilidade garantida · Qualidade garantida</p>
          </div>
        </a>
        <p className="sponsor-card__handle">@naelsonsoares10</p>
      </Card>
    </>
  );
}
