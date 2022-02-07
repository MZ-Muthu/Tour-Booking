class tourFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        let queryObj = { ...this.queryString };

        let fields = ['page', 'sort', 'fields', 'limit'];
        fields.forEach(el => delete queryObj[el]); 
        queryObj = JSON.stringify(queryObj);
        queryObj = queryObj.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        this.query.find(JSON.parse(queryObj));
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort("-createdAt")
        }
        return this;
    }
    fieldSelect() {
        if (this.queryString.fields) {
            let fieldBy = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fieldBy);
        }
        else {
            this.query = this.query.select("-__v")
        }
        return this;
    }
    pagenate() {
        let tourPage = this.queryString.page * 1 || 1;
        let tourLimit = this.queryString.limit * 1 || 10;
        let tourSkip = (tourPage - 1) * tourLimit;

        this.query = this.query.skip(tourSkip).limit(tourLimit);
        return this;
    }
}

module.exports = tourFeatures