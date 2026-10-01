const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const BOARD_EMAILS = [
  "trad.zaineb@esprit.tn",
  "touati.sayad@esprit.tn",
  "laourine.mokhtar@esprit.tn",
  "jaouadi.maram@esprit.tn",
  "azri.maram@esprit.tn",
  "karou.faten@esprit.tn",
  "bouzid.ines@esprit.tn",
  "cheikh.imen@esprit.tn",
  "nahal.malek@esprit.tn",
  "lbabda.mohamedamine@esprit.tn"
];

const ADMIN_EMAIL = "feresfatmi07@gmail.com";

async function main() {
  console.log("Updating board members...");

  // 1. Demote everyone (except admin) to "MEMBRE"
  const demoteRes = await prisma.user.updateMany({
    where: {
      email: {
        not: ADMIN_EMAIL
      }
    },
    data: {
      role: "MEMBRE"
    }
  });
  console.log(`Demoted ${demoteRes.count} users to MEMBRE.`);

  // 2. Promote Feres to ADMIN just in case
  await prisma.user.updateMany({
    where: { email: ADMIN_EMAIL },
    data: { role: "ADMIN" }
  });
  console.log(`Ensured ${ADMIN_EMAIL} is ADMIN.`);

  // 3. Ensure board members exist and promote them to a board role (e.g. RESPONSABLE_CELLULE)
  for (const email of BOARD_EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { role: "RESPONSABLE_CELLULE" }
      });
      console.log(`Promoted ${email} to RESPONSABLE_CELLULE.`);
    } else {
      console.log(`${email} does not exist in the database yet. They need to sign up first to get board access, or we can pre-create them.`);
      // Let's pre-create them with a default password so they have access immediately
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Cisco@2024", 10);
      
      await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0].replace(".", " "),
          password: hashedPassword,
          role: "RESPONSABLE_CELLULE"
        }
      });
      console.log(`Created ${email} as RESPONSABLE_CELLULE with default password.`);
    }
  }

  console.log("Finished updating board access.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
