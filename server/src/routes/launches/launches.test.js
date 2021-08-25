const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
   test('It should respond with 200 success', async () => {
      const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
   });
});


describe('Test POST /launch', () => {
   const completeLaunchData = {
      mission: 'testing mission',
      rocket: 'test001',
      target: 'Kepler-186 f',
      launchDate: 'January 3, 2030',
   };

   const luanchDataWithoutDate = {
      mission: 'testing mission',
      rocket: 'test001',
      target: 'Kepler-186 f'
   };

   const luanchDataWithInvalidDate = {
      mission: 'testing mission',
      rocket: 'test001',
      target: 'Kepler-186 f',
      launchDate: 'NOT A DATE',
   };

   test('It should respond with 201 created', async () => {
      const response = await request(app)
         .post('/launches')
         .send(completeLaunchData)
         .expect('Content-Type', /json/)
         .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate)

      expect(response.body).toMatchObject(luanchDataWithoutDate);
   });

   test('It should catch missing required proprieties', async () =>  {
      const response = await request(app)
         .post('/launches')
         .send(luanchDataWithoutDate)
         .expect('Content-Type', /json/)
         .expect(400);

      expect(response.body).toStrictEqual({
         error: 'Missing required launch propriety'
      });
   });

   test('It should catch invalid dates',async () => {
      const response = await request(app)
         .post('/launches')
         .send(luanchDataWithInvalidDate)
         .expect('Content-Type', /json/)
         .expect(400);

      expect(response.body).toStrictEqual({
         error: 'Invalid launch date'
      });
   });
})