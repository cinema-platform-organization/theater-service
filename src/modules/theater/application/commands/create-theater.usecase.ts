import { Injectable } from "@nestjs/common";

import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";

@Injectable()
export class CreateTheaterUsecase {
	public constructor(private readonly repository: TheaterRepositoryPort) {}

	public execute(data: { name: string; address: string }) {
		return this.repository.create(data);
	}
}
