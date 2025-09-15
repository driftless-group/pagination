const path = require('path');
var mongoose = require('mongoose');

var keywords = ['limit', 'skip', 'select', 'sort'],
  paginationKeywords = ['page', 'count'];


function paginate(schema, options={}) {
  schema.statics.paginate = function(query, opts={}) {
    var self = this;
    var queryOptions = {},
      pagination = {count: 25, page: 1};

    if (opts.cursor == undefined) {
      opts.cursor = true
    }

    return new Promise(async(resolve, reject) => {
      pagination = paginationKeywords.reduce(function(pager, keyword) {
        if (query[keyword] != undefined) {
          pager[keyword] = query[keyword];
          delete query[keyword];
        } 
        return pager;
      }, pagination);

      queryOptions = keywords.reduce(function(opts, keyword) {
        if (query[keyword] != undefined) {
          opts[keyword] = query[keyword];
          delete query[keyword];
        } 
        return opts;
      }, queryOptions);


      queryOptions.limit = pagination.count;
      queryOptions.skip  = (pagination.page - 1) * pagination.count;


      var total   = await this.countDocuments(query); 
      var builder = this.find(query);


      builder = keywords.reduce((queryBuilder, word) => {
        if (queryOptions[word] != undefined) {
          builder = builder[word](queryOptions[word]);
        }       
        return queryBuilder;
      }, builder)


      builder.then((documents) => {
        var report = {};

        report.documents  = documents;
        report.total      = {count: total, pages: (total / queryOptions.limit)};
        
        if (opts.query) {
          report.query      = query;
          report.ref     = self.modelName;
          report.options = queryOptions;
        }

        if (opts.cursor) {
          report.current       = JSON.parse(JSON.stringify(query));
          report.current.count = pagination.count;
          report.current.page  = pagination.page;

          report.next          = JSON.parse(JSON.stringify(query));
          report.next.count    = pagination.count;
          report.next.page     = pagination.page + 1;
        }

        report = ['sort', 'select'].reduce((report, word) => {
          if (queryOptions[word] != undefined) {
            report.current[word] = queryOptions[word];
            report.next[word]    = queryOptions[word];
          }
          return report;
        }, report);

        report.ts         = new Date();

        resolve(report)
      }).catch(reject);
    })
  }
}

module.exports = paginate;

