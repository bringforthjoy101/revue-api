import { BusinessDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class Business {
	public async create({ name, email, phone, code, userId }: BusinessDataType) {
		try {
			await DB.businesses.create({ name, email, phone, code, userId });
			return fnResponse({ status: true, message: `Business created!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.businesses.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No businesses available!`, data });
			return fnResponse({ status: true, message: `${data.length} business${data.length > 1 ? 'es' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Businesses with id ${id} not found!` });
			return fnResponse({ status: true, message: `Businesses listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, name, email, phone, code, userId }: BusinessDataType) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });
			const updateData: BusinessDataType = { name, email, phone, code, userId };
			await data.update(updateData);
			return fnResponse({ status: true, message: `Business successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Business successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
