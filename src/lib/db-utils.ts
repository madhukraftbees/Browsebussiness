// src/lib/db-utils.ts
export async function withDB<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      const { connectDB } = await import('@/lib/mongodb');
      await connectDB();
      return await operation();
    } catch (error) {
      console.error(`❌ ${errorMessage}:`, error);
      throw error;
    }
  }