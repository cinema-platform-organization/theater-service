import { TheaterEntity } from "../entities/theater.entity";

export abstract class TheaterRepositoryPort {
	public abstract findAll(): Promise<TheaterEntity[]>;
	public abstract findById(id: string): Promise<TheaterEntity | null>;
	public abstract create(data: {
		name: string;
		address: string;
	}): Promise<TheaterEntity>;
	public abstract update(
		id: string,
		data: { name?: string; address?: string },
	): Promise<TheaterEntity>;
	public abstract delete(id: string): Promise<void>;
}
