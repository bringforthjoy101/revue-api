import { StaffDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class Staff {
	public async create({ names, email, phone, businessId }: StaffDataType) {
		try {
			await DB.staffs.create({ names, email, phone, businessId });
			return fnResponse({ status: true, message: `Staff created!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll(businessId: number) {
		try {
			const data = await DB.staffs.findAll({ where: { businessId } });
			if (!data.length) return fnResponse({ status: true, message: `No staffs available!`, data });
			return fnResponse({ status: true, message: `${data.length} staff${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.staffs.findOne({ where: { id }, include: { model: DB.comments, attributes: ['id', 'comment', 'createdAt'] } });
			if (!data) return fnResponse({ status: false, message: `Staffs with id ${id} not found!` });
			return fnResponse({ status: true, message: `Staffs listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, names, email, phone, status }: StaffDataType) {
		try {
			const data = await DB.staffs.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Staff with id ${id} not found!` });
			const updateData: StaffDataType = { names, email, phone, status };
			await data.update(updateData);
			return fnResponse({ status: true, message: `Staff successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.staffs.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Staff with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Staff successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
