import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SAMPLE_VINYLS = [
  { artist: "The Beatles", album: "Abbey Road", year: 1969 },
  { artist: "The Beatles", album: "Sgt. Pepper's Lonely Hearts Club Band", year: 1967 },
  { artist: "Pink Floyd", album: "The Dark Side of the Moon", year: 1973 },
  { artist: "Pink Floyd", album: "The Wall", year: 1979 },
  { artist: "Led Zeppelin", album: "IV", year: 1971 },
  { artist: "David Bowie", album: "Heroes", year: 1977 },
  { artist: "Fleetwood Mac", album: "Rumours", year: 1977 },
  { artist: "Radiohead", album: "OK Computer", year: 1997 },
  { artist: "Miles Davis", album: "Kind of Blue", year: 1959 },
  { artist: "Bob Dylan", album: "Highway 61 Revisited", year: 1965 },
  { artist: "The Rolling Stones", album: "Exile on Main St.", year: 1972 },
  { artist: "Nirvana", album: "Nevermind", year: 1991 },
  { artist: "Talking Heads", album: "Remain in Light", year: 1980 },
  { artist: "Tom Waits", album: "Rain Dogs", year: 1985 },
  { artist: "Nick Drake", album: "Pink Moon", year: 1972 },
  { artist: "Joni Mitchell", album: "Blue", year: 1971 },
  { artist: "The Velvet Underground", album: "The Velvet Underground & Nico", year: 1967 },
  { artist: "Bruce Springsteen", album: "Born to Run", year: 1975 },
  { artist: "Prince", album: "Purple Rain", year: 1984 },
  { artist: "John Coltrane", album: "A Love Supreme", year: 1965 },
];

function randomDaysAgo(maxDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * maxDays));
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding database…");

  const password = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "test@spinify.dev" },
    update: {},
    create: { email: "test@spinify.dev", name: "Test User", password },
  });

  console.log(`User: ${user.email}`);

  for (const data of SAMPLE_VINYLS) {
    // Check if vinyl already exists to make seed idempotent
    const existing = await prisma.vinyl.findFirst({
      where: { artist: data.artist, album: data.album, userId: user.id },
    });

    const vinyl = existing ?? await prisma.vinyl.create({
      data: { ...data, userId: user.id },
    });

    if (existing) continue;

    // Add 0-5 random play logs in the past 60 days
    const playCount = Math.floor(Math.random() * 6);
    const usedDates = new Set<string>();

    for (let i = 0; i < playCount; i++) {
      let date: Date;
      let key: string;
      let attempts = 0;
      do {
        date = randomDaysAgo(60);
        key = date.toISOString().split("T")[0];
        attempts++;
      } while (usedDates.has(key) && attempts < 20);

      if (!usedDates.has(key)) {
        usedDates.add(key);
        await prisma.playLog.create({
          data: { vinylId: vinyl.id, userId: user.id, playedAt: date },
        });
      }
    }
  }

  console.log(`Seeded ${SAMPLE_VINYLS.length} vinyls`);
  console.log("Login: test@spinify.dev / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
