import type {
	CreateTheaterRequest,
	CreateTheaterResponse,
	DeleteTheaterRequest,
	DeleteTheaterResponse,
	GetTheaterRequest,
	GetTheaterResponse,
	ListTheatersResponse,
	UpdateTheaterRequest,
	UpdateTheaterResponse,
} from "@cinema-platform/contracts/gen/ts/theater";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { CreateTheaterUsecase } from "../../application/commands/create-theater.usecase";
import { DeleteTheaterUsecase } from "../../application/commands/delete-theater.usecase";
import { UpdateTheaterUsecase } from "../../application/commands/update-theater.usecase";
import { GetTheaterUsecase } from "../../application/queries/get-theater.usecase";
import { ListTheatersUsecase } from "../../application/queries/list-theaters.usecase";

@Controller()
export class TheaterGrpcController {
	public constructor(
		private readonly listUC: ListTheatersUsecase,
		private readonly getUC: GetTheaterUsecase,
		private readonly createUC: CreateTheaterUsecase,
		private readonly updateUC: UpdateTheaterUsecase,
		private readonly deleteUC: DeleteTheaterUsecase,
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

	@GrpcMethod("TheaterService", "UpdateTheater")
	public async update(
		data: UpdateTheaterRequest,
	): Promise<UpdateTheaterResponse> {
		const theater = await this.updateUC.execute(data.id, {
			name: data.name,
			address: data.address,
		});

		return { theater };
	}

	@GrpcMethod("TheaterService", "DeleteTheater")
	public async delete(
		data: DeleteTheaterRequest,
	): Promise<DeleteTheaterResponse> {
		await this.deleteUC.execute(data.id);

		return { ok: true };
	}
}
