
const { faker } = require('@faker-js/faker');

function createRandomUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    hash: faker.internet.password(),
    salt: faker.internet.password()
  };
}
module.exports.generatePerson = createRandomUser;
module.exports.generatePeople = function(number=20) {
  return faker.helpers.multiple(createRandomUser, {
    count: number,
  });
}



function createRandomPlace() {
  return {
    name: faker.company.name(),
    coordinates: [faker.location.latitude(), faker.location.longitude()]
  };
}
module.exports.generatePlace = createRandomPlace;
module.exports.generatePlaces = function(number=20) {
  return faker.helpers.multiple(createRandomPlace, {
    count: number,
  });
}


