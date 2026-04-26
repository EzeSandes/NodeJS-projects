/**
 * API Features - Advanced filtering, sorting, field selection, and pagination
 *
 * This class helps build complex queries for MongoDB in a clean and reusable way.
 * Supports: filtering, searching, sorting, field limiting, and pagination.
 */

class APIFeature {
  constructor(query, queryString) {
    this.query = query; // Mongoose query (Task.find())
    ({
      page: this.page,
      sort: this.sortProp,
      limit: this.limit,
      fields: this.fields,
      ...this.queryObj
    } = queryString);
  }

  filter() {
    // Advanced filtering: gt, gte, lt, lte
    let queryStr = JSON.stringify(this.queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    /* Ex: 
        GET /tasks?duration[gte]=5

        req.query = {
           duration: { gte: '5' }
        }
        
        JSON.stringify =>'{"duration":{"gte":"5"}}'
    
        queryStr.replace => '{"duration":{"$gte":"5"}}'
        */

    // Add search functionality (by title or content)
    if (this.queryObj.search) {
      const searchRegex = new RegExp(this.queryObj.search, 'i');
      this.query = this.query.find({
        $or: [{ title: searchRegex }, { content: searchRegex }],
      }); // Without the 'await' is not executed
    } else {
      this.query = this.query.find(JSON.parse(queryStr)); // Without the 'await' is not executed
    }

    return this;
  }

  // Field limiting (select specific fields)
  limitFields() {
    if (this.fields) {
      const fieldBy = this.fields.split(',').join(' ');
      this.query = this.query.select(fieldBy); // #DOC: https://mongoosejs.com/docs/api/query.html#Query.prototype.select()
    } else {
      this.query = this.query.select('-__v'); // '-' => Exclude(see docs)
    }

    return this;
  }

  paginate() {
    const pageNum = Number(this.page) || 1;
    const limitNum = Number(this.limit) || 100;
    const skip = (pageNum - 1) * this.limit;

    this.query = this.query.skip(skip).limit(limitNum);

    return this;
  }

  sort() {
    if (this.sortProp) {
      const sortBy = this.sortProp.split(',').join(' '); // #DOC: https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // '-' => descendent(see doc)
    }

    return this;
  }
}

export default APIFeature;
