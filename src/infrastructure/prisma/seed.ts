import { Prisma, PrismaClient } from "@generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	database: process.env.DATABASE_NAME,
});

const prisma = new PrismaClient({ adapter });

const THEATERS = [
	{
		name: "Silver Screen Cinema",
		address: "12 Victory Avenue, Kyiv",
		halls: [
			{ name: "Hall 1", rows: 8, seatsPerRow: 10 },
			{ name: "Hall 2", rows: 6, seatsPerRow: 8 },
		],
	},
	{
		name: "Golden Reel Multiplex",
		address: "45 Sunflower Street, Lviv",
		halls: [
			{ name: "Hall A", rows: 10, seatsPerRow: 12 },
			{ name: "Hall B", rows: 7, seatsPerRow: 9 },
			{ name: "VIP Hall", rows: 4, seatsPerRow: 6 },
		],
	},
	{
		name: "Starlight Movie House",
		address: "3 Independence Square, Kharkiv",
		halls: [{ name: "Main Hall", rows: 9, seatsPerRow: 11 }],
	},
];

function getSeatType(
	row: number,
	number: number,
	totalRows: number,
	seatsPerRow: number,
): string {
	const isBackRows = row >= totalRows - 2;

	const centerStart = Math.ceil(seatsPerRow / 3);
	const centerEnd = seatsPerRow - centerStart + 1;
	const isCenterColumn = number >= centerStart && number <= centerEnd;

	if (isBackRows && isCenterColumn) {
		return "premium";
	}
	if (isBackRows || isCenterColumn) {
		return "vip";
	}

	return "standard";
}

function getSeatPrice(type: string): number {
	switch (type) {
		case "premium":
			return 400;
		case "vip":
			return 250;
		default:
			return 150;
	}
}

async function main() {
	console.log("Seeding theaters, halls and seats...");

	for (const theaterData of THEATERS) {
		let theater = await prisma.theater.findFirst({
			where: { name: theaterData.name },
		});

		if (!theater) {
			theater = await prisma.theater.create({
				data: {
					name: theaterData.name,
					address: theaterData.address,
				},
			});
		}

		for (const hallData of theaterData.halls) {
			let hall = await prisma.hall.findFirst({
				where: { name: hallData.name, theaterId: theater.id },
			});

			if (!hall) {
				hall = await prisma.hall.create({
					data: {
						name: hallData.name,
						theaterId: theater.id,
					},
				});
			}

			const seats: Prisma.SeatCreateManyInput[] = [];

			for (let row = 1; row <= hallData.rows; row++) {
				for (let number = 1; number <= hallData.seatsPerRow; number++) {
					const type = getSeatType(
						row,
						number,
						hallData.rows,
						hallData.seatsPerRow,
					);
					const price = getSeatPrice(type);

					seats.push({
						row,
						number,
						x: number,
						y: row,
						type,
						price,
						hallId: hall.id,
					});
				}
			}

			await prisma.seat.createMany({
				data: seats,
				skipDuplicates: true,
			});
		}
	}

	console.log("Seed completed!");

	await prisma.$disconnect();
	process.exit(0);
}

main();
