import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Cisco Club ESPRIT database...\n");

  // ─── Nettoyage ─────────────────────────────────────────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.absenceJustification.deleteMany().catch(() => {});
  await prisma.attendance.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.actionItem.deleteMany();
  await prisma.meetingMinutes.deleteMany();
  await prisma.agendaItem.deleteMany();
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.event.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.document.deleteMany();
  await prisma.sponsorContact.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.member.deleteMany();
  await prisma.cell.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Base nettoyée");

  // ─── Cellules ──────────────────────────────────────────────────────────────
  const cells = await Promise.all([
    prisma.cell.create({ data: { name: "Bureau Exécutif", description: "Gouvernance et stratégie du club" } }),
    prisma.cell.create({ data: { name: "Technique", description: "Réseaux, Cisco, Cybersécurité" } }),
    prisma.cell.create({ data: { name: "Événementiel", description: "Organisation d'ateliers et conférences" } }),
    prisma.cell.create({ data: { name: "Communication", description: "Réseaux sociaux et marketing" } }),
    prisma.cell.create({ data: { name: "Sponsoring", description: "Partenariats et financement" } }),
  ]);
  const [cellBureau, cellTech, cellEvent, cellCom, cellSponsor] = cells;
  console.log(`✅ ${cells.length} cellules créées`);

  // ─── Utilisateurs & Membres ────────────────────────────────────────────────
  const hash = (p: string) => bcrypt.hash(p, 10);

  const usersData = [
    { firstName: "Sayad",         lastName: "Touati",    email: "touati.sayad@esprit.tn",        role: "PRESIDENT",            cell: cellBureau,  status: "ACTIF", position: "Président" },
    { firstName: "Mokhtar",       lastName: "Laourine",  email: "laourine.mokhtar@esprit.tn",    role: "VICE_PRESIDENT",       cell: cellBureau,  status: "ACTIF", position: "Vice-Président" },
    { firstName: "Zaineb",        lastName: "Trad",      email: "trad.zaineb@esprit.tn",         role: "ADMIN",                cell: cellBureau,  status: "ACTIF", position: "Admin" },
    { firstName: "Maram",         lastName: "Jaouadi",   email: "jaouadi.maram@esprit.tn",       role: "SECRETAIRE_GENERAL",   cell: cellBureau,  status: "ACTIF", position: "Secrétaire Général" },
    { firstName: "Maram",         lastName: "Azri",      email: "azri.maram@esprit.tn",          role: "RH",                   cell: cellBureau,  status: "ACTIF", position: "Responsable RH" },
    { firstName: "Faten",         lastName: "Karou",     email: "karou.faten@esprit.tn",         role: "TRESORIER_SPONSORING", cell: cellSponsor, status: "ACTIF", position: "Trésorière" },
    { firstName: "Ines",          lastName: "Bouzid",    email: "bouzid.ines@esprit.tn",         role: "RESPONSABLE_CELLULE",  cell: cellEvent,   status: "ACTIF", position: "Responsable Événementiel" },
    { firstName: "Imen",          lastName: "Cheikh",    email: "cheikh.imen@esprit.tn",         role: "RESPONSABLE_CELLULE",  cell: cellCom,     status: "ACTIF", position: "Responsable Communication" },
    { firstName: "Malek",         lastName: "Nahal",     email: "nahal.malek@esprit.tn",         role: "RESPONSABLE_CELLULE",  cell: cellTech,    status: "ACTIF", position: "Responsable Technique" },
    { firstName: "Mohamed Amine", lastName: "Lbabda",    email: "lbabda.mohamedamine@esprit.tn", role: "ADMIN",                cell: cellBureau,  status: "ACTIF", position: "Admin" },
  ];

  const createdUsers: any[] = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        firstName: u.firstName,
        lastName:  u.lastName,
        email:     u.email,
        role:      u.role,
        passwordHash: await hash("Cisco@2024"),
        emailVerified: new Date(),
        level:     "4ème année",
        specialty: "Réseaux & Télécom",
        memberProfile: {
          create: {
            status:   u.status,
            cellId:   u.cell.id,
            position: u.position,
            joinDate: new Date("2023-09-15"),
            certifications: u.cell.id === cellTech.id
              ? JSON.stringify(["CCNA 1", "CyberOps Associate"])
              : JSON.stringify([]),
            skills: JSON.stringify(["Travail en équipe", "Gestion de projet"]),
          }
        }
      },
      include: { memberProfile: true }
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} utilisateurs créés (mdp: Cisco@2024)`);

  // ─── Événements (5) ────────────────────────────────────────────────────────
  const events = await Promise.all([
    prisma.event.create({ data: {
      title: "Bootcamp CCNA Intensif — Module 1",
      description: "Session intensive sur les fondamentaux des réseaux (OSI, TCP/IP, routage, commutation). Pratique sur équipements réels Cisco.",
      category: "Formation",
      startDate: new Date("2024-10-15T09:00:00"),
      endDate:   new Date("2024-10-15T17:00:00"),
      location:  "Salle 04 — Bâtiment C, ESPRIT",
      capacity: 30, status: "TERMINE", budget: 500,
    }}),
    prisma.event.create({ data: {
      title: "Hackathon CyberSec — CTF Edition",
      description: "Compétition Capture The Flag sur 8h. Challenges en cryptographie, forensics, web et réseau. Lots à gagner !",
      category: "Compétition",
      startDate: new Date("2024-11-01T18:00:00"),
      endDate:   new Date("2024-11-02T02:00:00"),
      location:  "Hub d'Innovation ESPRIT",
      capacity: 100, status: "TERMINE", budget: 1200,
    }}),
    prisma.event.create({ data: {
      title: "Conférence : L'avenir du Cloud & des Réseaux SD-WAN",
      description: "Table ronde avec des ingénieurs Cisco et des experts industriels tunisiens sur les tendances cloud 2025.",
      category: "Conférence",
      startDate: new Date("2024-11-20T14:00:00"),
      endDate:   new Date("2024-11-20T17:00:00"),
      location:  "Amphithéâtre principal ESPRIT",
      capacity: 200, status: "PUBLIE", budget: 800,
    }}),
    prisma.event.create({ data: {
      title: "Atelier Wireshark — Analyse de trafic réseau",
      description: "Atelier pratique d'analyse de paquets réseau avec Wireshark. Niveau intermédiaire.",
      category: "Atelier",
      startDate: new Date("2024-10-28T14:00:00"),
      endDate:   new Date("2024-10-28T17:00:00"),
      location:  "Labo Réseaux L2 — Bâtiment B",
      capacity: 25, status: "TERMINE", budget: 0,
    }}),
    prisma.event.create({ data: {
      title: "Préparation NetRiders 2025",
      description: "Session de coaching pour la compétition NetRiders de Cisco. Travail sur les simulations Packet Tracer.",
      category: "Compétition",
      startDate: new Date("2024-12-05T10:00:00"),
      endDate:   new Date("2024-12-05T13:00:00"),
      location:  "Salle Informatique S10 — ESPRIT",
      capacity: 20, status: "PUBLIE", budget: 0,
    }}),
  ]);
  console.log(`✅ ${events.length} événements créés`);

  // ─── Inscriptions & Présences ──────────────────────────────────────────────
  const [evBootcamp, , , evWireshark] = events;
  const allMembers = createdUsers.slice(0, 10);

  for (const user of allMembers) {
    await prisma.registration.create({ data: { userId: user.id, eventId: evBootcamp.id, isWaitlist: false } });
    await prisma.attendance.create({ data: {
      userId: user.id, eventId: evBootcamp.id,
      status: Math.random() > 0.15 ? "PRESENT" : "ABSENT",
      scanMethod: "QR",
    }});
  }
  for (const user of allMembers.slice(0, 8)) {
    await prisma.registration.create({ data: { userId: user.id, eventId: evWireshark.id, isWaitlist: false } });
    await prisma.attendance.create({ data: {
      userId: user.id, eventId: evWireshark.id,
      status: Math.random() > 0.2 ? "PRESENT" : "RETARD",
      scanMethod: "MANUAL",
    }});
  }
  console.log("✅ Inscriptions et présences créées");

  // ─── Réunions (3) ──────────────────────────────────────────────────────────
  const [orgUser] = createdUsers;
  const meetings = await Promise.all([
    prisma.meeting.create({ data: {
      title: "Point Hebdo Bureau Exécutif",
      type: "Bureau Exécutif",
      objective: "Validation du plan d'action Q4 et suivi des KPI du trimestre.",
      startDate: new Date("2024-10-07T18:00:00"),
      duration: 90,
      location: "Salle Réunion — Incubateur ESPRIT",
      organizerId: orgUser.id,
      participants: { create: createdUsers.slice(0,5).map(u => ({ userId: u.id, status: "ACCEPTED" })) },
      agendaItems: { create: [
        { title: "Bilan des événements du mois", durationEst: 20, order: 1 },
        { title: "Préparation du Hackathon CTF", durationEst: 30, order: 2 },
        { title: "Budget et sponsoring", durationEst: 25, order: 3 },
        { title: "Divers", durationEst: 15, order: 4 },
      ]},
      minutes: { create: { content: "**Réunion du 7 octobre 2024**\n\n**Présents :** Youssef, Ines, Khalil, Ahmed, Sami\n\n**Décisions :**\n- Hackathon confirmé : 1er novembre 2024.\n- Budget : 1200 TND. Khalil valide avec les sponsors.\n- Sami coordonne la logistique salle." }},
    }}),
    prisma.meeting.create({ data: {
      title: "Réunion Préparation Bootcamp CCNA",
      type: "Cellule Technique",
      objective: "Finaliser le programme pédagogique et la logistique du bootcamp.",
      startDate: new Date("2024-10-03T14:00:00"),
      duration: 60,
      location: "Google Meet",
      organizerId: createdUsers[3].id,
      participants: { create: [createdUsers[3], createdUsers[4], createdUsers[9]].map(u => ({ userId: u.id, status: "ACCEPTED" })) },
      agendaItems: { create: [
        { title: "Validation du programme formateur", durationEst: 20, order: 1 },
        { title: "Choix des équipements réseau", durationEst: 15, order: 2 },
        { title: "Préparation des supports de cours", durationEst: 25, order: 3 },
      ]},
    }}),
    prisma.meeting.create({ data: {
      title: "Brainstorming Dossier Sponsoring 2025",
      type: "Cellule Sponsoring",
      objective: "Définir les offres de partenariat pour la saison 2024-2025.",
      startDate: new Date("2024-10-10T10:00:00"),
      duration: 75,
      location: "Microsoft Teams",
      organizerId: createdUsers[2].id,
      participants: { create: [createdUsers[2], createdUsers[8]].map(u => ({ userId: u.id, status: "ACCEPTED" })) },
    }}),
  ]);

  await prisma.actionItem.createMany({ data: [
    { meetingId: meetings[0].id, task: "Réserver le Hub d'Innovation", assigneeId: createdUsers[5].id, dueDate: new Date("2024-10-12"), status: "DONE" },
    { meetingId: meetings[0].id, task: "Valider la facture sponsor Cisco", assigneeId: createdUsers[2].id, dueDate: new Date("2024-10-15"), status: "DONE" },
    { meetingId: meetings[1].id, task: "Préparer les supports de cours CCNA Module 1", assigneeId: createdUsers[3].id, dueDate: new Date("2024-10-13"), status: "DONE" },
    { meetingId: meetings[2].id, task: "Rédiger la nouvelle grille tarifaire sponsors", assigneeId: createdUsers[8].id, dueDate: new Date("2024-10-20"), status: "IN_PROGRESS" },
  ]});
  console.log(`✅ ${meetings.length} réunions créées avec agendas et PV`);

  // ─── Sponsors (4) ──────────────────────────────────────────────────────────
  const sponsors = [
    {
      data: { name: "Cisco Systems", logoUrl: "/logos/cisco.png", sector: "Technologie Réseau", tier: "Platine", website: "https://www.cisco.com", status: "ACTIVE" },
      contact: { name: "Mehdi Lahmar", role: "Academy Manager", email: "m.lahmar@cisco.com", phone: "+216 71 000 001" },
      deal: { amountEstimated: 5000, amountReceived: 5000, probability: 100, ownerId: createdUsers[2].id },
      deliverables: [
        { description: "Logo sur toutes les affiches des événements", isDone: true },
        { description: "Stand au Hackathon CTF", isDone: true },
        { description: "Certification offerte pour le gagnant NetRiders", isDone: false },
      ],
    },
    {
      data: { name: "Vermeg", logoUrl: "/logos/vermeg.png", sector: "Fintech / IT", tier: "Or", website: "https://www.vermeg.com", status: "NEGOTIATION" },
      contact: { name: "Salma Baccouche", role: "DRH", email: "s.baccouche@vermeg.com", phone: "+216 71 000 002" },
      deal: { amountEstimated: 3000, amountReceived: 0, probability: 65, ownerId: createdUsers[2].id },
      deliverables: [{ description: "Présentation de l'entreprise lors d'un événement", isDone: false }],
    },
    {
      data: { name: "Orange Tunisie", sector: "Télécommunications", tier: "Argent", website: "https://www.orange.tn", status: "PROSPECT" },
      contact: { name: "Bilel Nasri", role: "Resp. Partenariats", email: "b.nasri@orange.tn", phone: "+216 71 000 003" },
      deal: { amountEstimated: 2000, amountReceived: 0, probability: 30, ownerId: createdUsers[8].id },
      deliverables: [],
    },
    {
      data: { name: "Proxym Group", sector: "Services IT", tier: "Bronze", website: "https://proxym-group.com", status: "SIGNED" },
      contact: { name: "Cyrine Jemaa", role: "Marketing Manager", email: "c.jemaa@proxym.com", phone: "+216 71 000 004" },
      deal: { amountEstimated: 1500, amountReceived: 1500, probability: 100, ownerId: createdUsers[2].id },
      deliverables: [
        { description: "Post Instagram dédié", isDone: true },
        { description: "Roll-up lors de la conférence", isDone: false },
      ],
    },
  ];

  for (const s of sponsors) {
    const sponsor = await prisma.sponsor.create({ data: s.data });
    await prisma.sponsorContact.create({ data: { ...s.contact, sponsorId: sponsor.id } });
    const deal = await prisma.deal.create({ data: { ...s.deal, sponsorId: sponsor.id, nextActionDate: new Date("2024-11-01") } });
    for (const d of s.deliverables) {
      await prisma.deliverable.create({ data: { ...d, dealId: deal.id } });
    }
  }
  console.log(`✅ ${sponsors.length} sponsors créés avec contacts et deals`);

  // ─── Évaluations ───────────────────────────────────────────────────────────
  const membersWithProfile = await prisma.member.findMany({ take: 8 });
  for (const member of membersWithProfile) {
    await prisma.evaluation.create({ data: {
      memberId:    member.id,
      evaluatorId: createdUsers[0].id,
      score:       Math.floor(Math.random() * 20) + 80,
      feedback:    "Membre impliqué et ponctuel. Bon esprit d'équipe et force de proposition.",
      period:      "Semestre 1 — 2024/2025",
    }});
  }
  console.log("✅ Évaluations créées");

  console.log("\n🎉 Seed terminé ! Résumé :");
  console.log(`   👤 Utilisateurs : ${usersData.length} (mdp universel: Cisco@2024)`);
  console.log(`   🏢 Cellules     : ${cells.length}`);
  console.log(`   📅 Événements   : ${events.length}`);
  console.log(`   🤝 Réunions     : ${meetings.length}`);
  console.log(`   💰 Sponsors     : ${sponsors.length}`);
  console.log(`\n   🔑 Admin email  : youssef.gharbi@esprit.tn`);
}

main()
  .catch(e => { console.error("❌ Seed échoué :", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
