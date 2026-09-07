import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/infrastructure/prisma/prisma.service";

import { TheaterEntity } from "../../domain/entities/theater.entity";
import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";

@Injectable()
export class TheaterPrismaRepository implements TheaterRepositoryPort {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(data: {
		name: string;
		address: string;
	}): Promise<TheaterEntity> {
		const theater = await this.prismaService.theater.create({ data });

		return new TheaterEntity(
			theater.id,
			theater.name,
			theater.address,
			theater.createdAt,
			theater.updatedAt,
		);
	}

	public async findById(id: string): Promise<TheaterEntity | null> {
		const theater = await this.prismaService.theater.findUnique({
			where: {
				id,
			},
		});

		return theater
			? new TheaterEntity(
					theater.id,
					theater.name,
					theater.address,
					theater.createdAt,
					theater.updatedAt,
				)
			: null;
	}

	public async findAll(): Promise<TheaterEntity[]> {
		const items = await this.prismaService.theater.findMany({
			orderBy: {
				name: "asc",
			},
		});

		return items.map(
			theater =>
				new TheaterEntity(
					theater.id,
					theater.name,
					theater.address,
					theater.createdAt,
					theater.updatedAt,
				),
		);
	}
}
