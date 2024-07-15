import 'reflect-metadata';
import { app } from '@azure/functions';
import { pokemonsHandler } from '../handlers';

app.http('pokemonsHandler', {
  methods: ['GET'],
  route: 'HttpTrigger',
  authLevel: 'anonymous',
  handler: pokemonsHandler,
});
