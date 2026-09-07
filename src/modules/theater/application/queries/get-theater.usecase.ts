import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";

@Injectable()
export class GetTheaterUsecase {
	public constructor(private readonly repository: TheaterRepositoryPort) {}

	public async execute(id: string) {
		const theater = await this.repository.findById(id);

		if (!theater) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Theater not found",
			});
		}

		return theater;
	}
}
