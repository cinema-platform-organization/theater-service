import type {
	CreateTheaterRequest,
	CreateTheaterResponse,
	GetTheaterRequest,
	GetTheaterResponse,
	ListTheatersResponse,
} from "@cinema-platform/contracts/gen/ts/theater";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { CreateTheaterUsecase } from "../../application/commands/create-theater.usecase";
import { GetTheaterUsecase } from "../../application/queries/get-theater.usecase";
import { ListTheatersUsecase } from "../../application/queries/list-theaters.usecase";

@Controller()
export class TheaterGrpcController {
	public constructor(
		private readonly listUC: ListTheatersUsecase,
		private readonly getUC: GetTheaterUsecase,
		private readonly createUC: CreateTheaterUsecase,
	) {}

	@GrpcMethod("TheaterService", "ListTheaters")
	public async getAll(): Promise<ListTheatersResponse> {
		const theaters = await this.listUC.execute();

		return { theaters };
	}

	@GrpcMethod("TheaterService", "GetTheater")
	public async getById(data: GetTheaterRequest): Promise<GetTheaterResponse> {
		const theater = await this.getUC.execute(data.id);

		return { theater };
	}

	@GrpcMethod("TheaterService", "CreateTheater")
	public async create(
		data: CreateTheaterRequest,
	): Promise<CreateTheaterResponse> {
		const theater = await this.createUC.execute(data);

		return { theater };
	}
}
