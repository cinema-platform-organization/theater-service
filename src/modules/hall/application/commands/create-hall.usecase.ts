import { Injectable } from "@nestjs/common";

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
		return this.prismaService.$transaction(async () => {
			const hall = await this.repository.create(data);

			await this.repository.createSeats({
				hallId: hall.id,
				layout: data.layout,
			});

			return hall;
		});
	}
}
