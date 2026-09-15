import { SeatCreateManyInput } from "@generated/models";
import { Injectable } from "@nestjs/common";

import { Prisma } from "@/generated/client/client";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";

import { HallEntity } from "../../domain/entities/hall.entity";
import {
	HallRepositoryPort,
	RowLayout,
} from "../../domain/ports/hall.repository.port";

type TxClient = Prisma.TransactionClient;

@Injectable()
export class HallPrismaRepository implements HallRepositoryPort {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(
		data: { name: string; theaterId: string; layout: RowLayout[] },
		tx?: TxClient,
	): Promise<HallEntity> {
		const client = tx ?? this.prismaService;

		const hall = await client.hall.create({
			data: {
				name: data.name,
				theater: {
					connect: { id: data.theaterId },
				},
			},
		});

		return new HallEntity(
			hall.id,
			hall.name,
			hall.theaterId,
			hall.createdAt,
			hall.updatedAt,
		);
	}

	public async findById(id: string): Promise<HallEntity | null> {
		const hall = await this.prismaService.hall.findUnique({
			where: {
				id,
			},
		});

		return hall
			? new HallEntity(
					hall.id,
					hall.name,
					hall.theaterId,
					hall.createdAt,
					hall.updatedAt,
				)
			: null;
	}

	public async listByTheater(theaterId: string): Promise<HallEntity[]> {
		const items = await this.prismaService.hall.findMany({
			where: {
				theaterId,
			},
			orderBy: {
				name: "asc",
			},
		});

		return items.map(
			hall =>
				new HallEntity(
					hall.id,
					hall.name,
					hall.theaterId,
					hall.createdAt,
					hall.updatedAt,
				),
		);
	}

	public async createSeats(
		data: { hallId: string; layout: RowLayout[] },
		tx?: TxClient,
	): Promise<void> {
		const client = tx ?? this.prismaService;
		const seats: SeatCreateManyInput[] = [];

		for (const rowConfig of data.layout) {
			for (let num = 1; num <= rowConfig.columns; num++) {
				seats.push({
					row: rowConfig.row,
					number: num,
					hallId: data.hallId,
					type: rowConfig.type,
					price: rowConfig.price,
					x: num,
					y: rowConfig.row,
				});
			}
		}

		await client.seat.createMany({
			data: seats,
		});
	}

	public async update(
		id: string,
		data: { name?: string },
	): Promise<HallEntity> {
		const hall = await this.prismaService.hall.update({
			where: { id },
			data,
		});

		return new HallEntity(
			hall.id,
			hall.name,
			hall.theaterId,
			hall.createdAt,
			hall.updatedAt,
		);
	}

	public async delete(id: string): Promise<void> {
		await this.prismaService.hall.delete({ where: { id } });
	}
}
