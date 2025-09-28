// src/lib/database.ts

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'; // 1. Adicione esta linha

declare global {
  var __prisma: PrismaClient | undefined;
}

// 2. Modifique esta linha para adicionar .$extends(withAccelerate())
export const prisma = globalThis.__prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// O restante das funções (connectDatabase, etc.) pode ser removido,
// pois o Accelerate gerencia a conexão para você.
// Mas se quiser mantê-las, não há problema.

export async function checkDatabaseHealth() {
  try {
    // Usar uma query simples que funciona com Accelerate
    await prisma.user.findFirst({ select: { id: true } });
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', error: (error as Error).message, timestamp: new Date() };
  }
}