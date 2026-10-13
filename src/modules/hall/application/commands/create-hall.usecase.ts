import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { Prisma } from "@/generated/client/client";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";

import {
	HallRepositoryPort,
	RowLayout,
} from "../../domain/ports/hall.repository.port";

@Injectable()
export class CreateHallUsecase {
	public constructor(
		private readonly repository: HallRepositoryPort,
		private readonly prismaService: PrismaService,
	) {}

	public async execute(data: {
		name: string;
		theaterId: string;
		layout: RowLayout[];
	}) {
		try {
			return await this.prismaService.$transaction(async tx => {
				const hall = await this.repository.create(data, tx);

				await this.repository.createSeats(
					{ hallId: hall.id, layout: data.layout },
					tx,
				);

				return hall;
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				throw new RpcException({
					code: RpcStatus.NOT_FOUND,
					details: "Theater not found",
				});
			}
			throw error;
		}
	}
}
