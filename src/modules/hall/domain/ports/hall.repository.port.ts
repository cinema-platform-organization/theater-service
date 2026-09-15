import { HallEntity } from "../entities/hall.entity";

export interface RowLayout {
	row: number;
	columns: number;
	type: string;
	price: number;
}

export abstract class HallRepositoryPort {
	public abstract create(
		data: { name: string; theaterId: string; layout: RowLayout[] },
		tx?: unknown,
	): Promise<HallEntity>;
	public abstract findById(id: string): Promise<HallEntity | null>;
	public abstract listByTheater(theaterId: string): Promise<HallEntity[]>;
	public abstract createSeats(
		data: { hallId: string; layout: RowLayout[] },
		tx?: unknown,
	): Promise<void>;
	public abstract update(
		id: string,
		data: { name?: string },
	): Promise<HallEntity>;
	public abstract delete(id: string): Promise<void>;
}
