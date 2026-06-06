import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Database seeding initialized...");

  // 1. Clear existing database rows for full rebuild repeatability
  await prisma.appointment.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.client.deleteMany();

  console.log("🧹 Previous database rows wiped successfully.");

  // 2. Create sample clients
  const client1 = await prisma.client.create({
    data: {
      name: "Givence Awuor",
      phone: "0717 634003",
      email: "givence@gmail.com",
      address: "Kileleshwa Estate, Nairobi",
      notes: "Prefers elegant marble accents, brass trim fittings, and warm cream textures. Fully complete residential renovation folder.",
      status: "completed",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Ogare Ted",
      phone: "0722 123456",
      email: "ted.ogare@domain.com",
      address: "Westlands Mall Chambers, Nairobi",
      notes: "Commercial executive lounge design. Requires brand-aligned dark tones, acoustic divider screens, and ergonomic custom leather workspace furniture.",
      status: "active",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Amanda Kimani",
      phone: "0733 987654",
      email: "amanda.k@airbnb-hosts.co.ke",
      address: "Kilimani Apartments Block B1, Nairobi",
      notes: "Short let host looking for immediate premium transformation to increase Airbnb pricing tier. Focus on durable linen textiles, accent light fixtures, and wall art.",
      status: "lead",
    },
  });

  console.log("👥 Seeded 3 primary clients into CRM.");

  // 3. Create sample enquiries (both linked to clients & fresh unlinked leads)
  await prisma.enquiry.create({
    data: {
      name: "Givence Awuor",
      phone: "0717 634003",
      email: "givence@gmail.com",
      service: "Interior Design",
      message: "I am looking for a full concept remodel of my 4-bedroom townhouse lounge in Kileleshwa. I want a modern luxury feel with gold elements.",
      status: "replied",
      clientId: client1.id,
      createdAt: new Date("2026-05-10T10:00:00Z"),
    },
  });

  await prisma.enquiry.create({
    data: {
      name: "Amanda Kimani",
      phone: "0733 987654",
      email: "amanda.k@airbnb-hosts.co.ke",
      service: "Short Let Styling",
      message: "Hi, I have a newly built 2-bedroom apartment in Kilimani. I want to launch it on Airbnb next month. Do you guys provide swift styling & furniture sourcing?",
      status: "read",
      clientId: client3.id,
      createdAt: new Date("2026-06-01T14:30:00Z"),
    },
  });

  // Fresh unread / new enquiries
  await prisma.enquiry.create({
    data: {
      name: "Benson Ngugi",
      phone: "0755 443 322",
      email: "benson@ngugi-law.co.ke",
      service: "Office Design",
      message: "We are relocating our small legal firm to Westlands offices on Karuna Rd. Need layout flow optimization & corporate fit-outs for 6 staff desks and reception.",
      status: "new",
      createdAt: new Date("2026-06-04T09:15:00Z"),
    },
  });

  await prisma.enquiry.create({
    data: {
      name: "Zainab Salim",
      phone: "0790 887 766",
      email: "zainab@interior-lovers.me",
      service: "Space Planning",
      message: "Looking for consultation layout suggestions for my kitchen diner. The walk-through space feels cluttered and needs structural layout advice.",
      status: "new",
      createdAt: new Date("2026-06-05T08:00:00Z"),
    },
  });

  console.log("📨 Seeded 4 customer enquiries (2 new leads highlighted in gold).");

  // 4. Create sample appointments (upcoming & completed)
  // Base date around current simulated day: 2026-06-05
  await prisma.appointment.create({
    data: {
      title: "Givence Awuor - Handover Unveiling",
      clientName: "Givence Awuor",
      phone: "0717 634003",
      service: "Interior Design",
      date: new Date("2026-05-25T15:00:00Z"), // Completed in the past
      duration: 120,
      status: "completed",
      notes: " walk-through complete. Client delighted with gold trim and velvet upholstery setup. Closed successfully.",
      clientId: client1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      title: "Ogare Ted - Space Planning Site Review",
      clientName: "Ogare Ted",
      phone: "0722 123456",
      service: "Office Design",
      date: new Date("2026-06-10T09:30:00Z"), // Upcoming
      duration: 90,
      status: "confirmed",
      notes: "Bringing mechanical layouts and samples of acoustic board choices. Meeting directly at Westlands site chambers.",
      clientId: client2.id,
    },
  });

  await prisma.appointment.create({
    data: {
      title: "Amanda Kimani - Airbnb Consultation",
      clientName: "Amanda Kimani",
      phone: "0733 987654",
      service: "Short Let Styling",
      date: new Date("2026-06-12T14:00:00Z"), // Upcoming
      duration: 60,
      status: "confirmed",
      notes: "Initial site dimensions collection and key arrangement briefing. Bring the short let pricing catalogs.",
      clientId: client3.id,
    },
  });

  console.log("📆 Seeded 3 calendars bookings.");
  console.log("✨ Seed script completed successfully database seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Error running seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
