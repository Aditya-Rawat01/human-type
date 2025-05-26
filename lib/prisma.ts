import { PrismaClient } from '@prisma/client';

// This declares that a 'prisma' variable might exist on the global scope
// and if it does, it's a PrismaClient or undefined.
declare global {
  // eslint-disable-next-line no-unused-vars, no-var
  var prisma: PrismaClient | undefined;
}

// Check if we are in production or if prisma is already defined.
// In development, use the global prisma instance to avoid creating too many connections.
const prisma = global.prisma || new PrismaClient({
  // Optional: log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; // Export the instance
