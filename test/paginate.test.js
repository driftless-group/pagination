process.env.NODE_ENV = 'test';
const path   = require('path');
const assert = require('assert');

const {
  generatePerson,
  generatePeople,
  generatePlaces
} = require(path.join(__dirname, 'helpers'));

const { Person } = require(path.join(__dirname, 'person'));
const { Place }  = require(path.join(__dirname, 'place'));

require(path.join(__dirname, 'db'));

describe('paginate', function() {

  before(function(done) {
    var people = generatePeople(100);
    var places = generatePlaces(1026);

    Person.deleteMany({}).then(() => {
      Person.insertMany(people).then(() => {
        Place.deleteMany({}).then(() => {
          Place.insertMany(places).then(() => {
            done();
          }).catch(console.log);
        })
      }).catch(console.log);
    })
  })

  it('should have something to paginate', function(done) {
    Person.paginate({count: 10, sort: 'username'}).then((response) => {
      
      //console.log(response);
      assert.equal(response.documents.length, 10);
      assert.equal(response.total.count, 100);
      assert.equal(response.total.pages, 10);

      assert.equal(response.current.count, 10);
      assert.equal(response.current.page, 1);
      assert.equal(response.current.sort, 'username')

      assert.equal(response.next.count, 10);
      assert.equal(response.next.page, 2);
      assert.equal(response.next.sort, 'username')

      done();
    }).catch(console.log)
  })

  it('page math, should round up', function(done) {
    Place.paginate({sort: 'name'}).then((response) => {
      
      //console.log(response);
      
      assert.equal(response.documents.length, 25);
      assert.equal(response.total.count, 1026);
      assert.equal(response.total.pages, 42);

      assert.equal(response.current.count, 25);
      assert.equal(response.current.page, 1);
      assert.equal(response.current.sort, 'name')

      assert.equal(response.next.count, 25);
      assert.equal(response.next.page, 2);
      assert.equal(response.next.sort, 'name')
      
      done();
    }).catch(console.log)
  })
})
