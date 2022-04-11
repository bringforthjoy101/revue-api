import { CommentDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class Comment {
	public async create({ comment, staffId, businessId }: CommentDataType) {
		try {
			await DB.comments.create({ comment, staffId, businessId });

			return fnResponse({ status: true, message: `Comment created!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll(businessId: number) {
		try {
			const data = await DB.comments.findAll({
				where: { businessId },
				attributes: { exclude: ['staffId', 'businessId', 'updatedAt'] },
				include: { model: DB.staffs, attributes: ['id', 'names'] },
				order: [['createdAt', 'DESC']],
			});
			if (!data.length) return fnResponse({ status: true, message: `No comments available!`, data });
			return fnResponse({ status: true, message: `${data.length} comment${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.comments.findOne({
				where: { id },
				attributes: { exclude: ['staffId', 'businessId', 'updatedAt'] },
				include: { model: DB.staffs, attributes: ['id', 'names'] },
			});
			if (!data) return fnResponse({ status: false, message: `Comments with id ${id} not found!` });
			return fnResponse({ status: true, message: `Comments listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, comment, staffId, businessId }: CommentDataType) {
		try {
			const data = await DB.comments.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Comment with id ${id} not found!` });
			const updateData: CommentDataType = { comment, staffId, businessId };
			await data.update(updateData);
			return fnResponse({ status: true, message: `Comment successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.comments.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Comment with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Comment successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
