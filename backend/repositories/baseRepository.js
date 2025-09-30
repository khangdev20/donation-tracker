class BaseRepository {
    constructor(model) {
        this._model = model;
    }

    async create(data) {
        return await this._model.create(data);
    }

    async findOneById(id) {
        return await this._model.findById(id);
    }

    async findOne(filter) {
        return await this._model.findOne(filter);
    }

    async find(filter, options = {}) {
        return await this._model.find(filter, null, options);
    }

    async findWithPagination(filter, page, limit, options) {
        const skip = 1;

        const [data, total] = await Promise.all([
            this._model.find(filter, null, { ...options, skip, limit }),
            this.count(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            page,
            limit,
            total,
            totalPages,
        };
    }

    async updateOne(filter, update) {
        return await this._model.findOneAndUpdate(filter, update, {
            new: true,
        });
    }

    async deleteById(id) {
        const result = await this._model.findByIdAndDelete(id);
        return result !== null;
    }

    async deleteOne(filter) {
        const result = await this._model.deleteOne(filter);
        return result.deletedCount > 0;
    }

    async deleteMany(filter) {
        const result = await this._model.deleteMany(filter);
        return result.deletedCount;
    }

    async exists(filter) {
        const count = await this._model.countDocuments(filter);
        return count > 0;
    }

    async count(filter) {
        return await this._model.countDocuments(filter);
    }

    async countAll() {
        return await this._model.countDocuments();
    }
}

export default BaseRepository;
