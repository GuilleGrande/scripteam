import { databaseService } from './database';

export interface TransactionContext {
  id: string;
  operations: Array<{
    type: 'insert' | 'update' | 'delete' | 'file_store' | 'file_delete';
    table?: string;
    data?: Record<string, unknown>;
    condition?: string;
    filePath?: string;
    rollbackQuery?: string;
  }>;
  completed: boolean;
  rolledBack: boolean;
}

export class TransactionService {
  private static transactions = new Map<string, TransactionContext>();

  /**
   * Start a new transaction
   */
  static async begin(): Promise<string> {
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const context: TransactionContext = {
      id: transactionId,
      operations: [],
      completed: false,
      rolledBack: false
    };

    this.transactions.set(transactionId, context);

    try {
      await databaseService.query('BEGIN');
      console.log(`🔄 Transaction ${transactionId} started`);
      return transactionId;
    } catch (error) {
      this.transactions.delete(transactionId);
      throw new Error(`Failed to start transaction: ${error}`);
    }
  }

  /**
   * Execute a database operation within a transaction
   */
  static async execute(
    transactionId: string,
    query: string,
    params: unknown[] = [],
    rollbackQuery?: string
  ): Promise<unknown> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (context.completed || context.rolledBack) {
      throw new Error(`Transaction ${transactionId} is already ${context.completed ? 'completed' : 'rolled back'}`);
    }

    try {
      const result = await databaseService.query(query, params);

      // Record the operation for potential rollback
      context.operations.push({
        type: this.getOperationType(query),
        data: { query, params },
        rollbackQuery
      });

      return result;
    } catch (error) {
      console.error(`❌ Transaction ${transactionId} operation failed:`, error);
      await this.rollback(transactionId);
      throw error;
    }
  }

  /**
   * Commit a transaction
   */
  static async commit(transactionId: string): Promise<void> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (context.rolledBack) {
      throw new Error(`Transaction ${transactionId} was already rolled back`);
    }

    try {
      await databaseService.query('COMMIT');
      context.completed = true;
      console.log(`✅ Transaction ${transactionId} committed successfully`);
    } catch (error) {
      console.error(`❌ Transaction ${transactionId} commit failed:`, error);
      await this.rollback(transactionId);
      throw error;
    } finally {
      // Clean up transaction context after delay
      setTimeout(() => {
        this.transactions.delete(transactionId);
      }, 30000); // Keep for 30 seconds for debugging
    }
  }

  /**
   * Rollback a transaction
   */
  static async rollback(transactionId: string): Promise<void> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      console.warn(`⚠️ Transaction ${transactionId} not found for rollback`);
      return;
    }

    if (context.rolledBack) {
      console.warn(`⚠️ Transaction ${transactionId} already rolled back`);
      return;
    }

    try {
      await databaseService.query('ROLLBACK');
      context.rolledBack = true;
      console.log(`🔄 Transaction ${transactionId} rolled back`);

      // Execute any custom rollback operations
      for (const operation of context.operations.reverse()) {
        if (operation.rollbackQuery) {
          try {
            await databaseService.query(operation.rollbackQuery);
            console.log(`🔄 Executed rollback query for operation`);
          } catch (rollbackError) {
            console.error(`❌ Rollback operation failed:`, rollbackError);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Transaction ${transactionId} rollback failed:`, error);
      throw error;
    } finally {
      setTimeout(() => {
        this.transactions.delete(transactionId);
      }, 30000);
    }
  }

  /**
   * Execute a function within a transaction context
   */
  static async withTransaction<T>(
    operation: (transactionId: string) => Promise<T>
  ): Promise<T> {
    const transactionId = await this.begin();

    try {
      const result = await operation(transactionId);
      await this.commit(transactionId);
      return result;
    } catch (error) {
      await this.rollback(transactionId);
      throw error;
    }
  }

  /**
   * Get operation type from SQL query
   */
  private static getOperationType(query: string): 'insert' | 'update' | 'delete' | 'file_store' | 'file_delete' {
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.startsWith('insert')) return 'insert';
    if (cleanQuery.startsWith('update')) return 'update';
    if (cleanQuery.startsWith('delete')) return 'delete';
    return 'insert'; // default
  }

  /**
   * Health check for active transactions
   */
  static getActiveTransactions(): Array<{ id: string; operationCount: number; startTime: string }> {
    return Array.from(this.transactions.values())
      .filter(tx => !tx.completed && !tx.rolledBack)
      .map(tx => ({
        id: tx.id,
        operationCount: tx.operations.length,
        startTime: tx.id.split('_')[1] ? new Date(parseInt(tx.id.split('_')[1])).toISOString() : 'unknown'
      }));
  }

  /**
   * Cleanup stale transactions (older than 5 minutes)
   */
  static cleanupStaleTransactions(): void {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    for (const [id, context] of this.transactions.entries()) {
      const timestamp = parseInt(id.split('_')[1]);
      if (timestamp && timestamp < fiveMinutesAgo && !context.completed) {
        console.warn(`🧹 Cleaning up stale transaction ${id}`);
        this.rollback(id).catch(error => {
          console.error(`❌ Failed to cleanup stale transaction ${id}:`, error);
        });
      }
    }
  }
}

// Cleanup stale transactions every 5 minutes
setInterval(() => {
  TransactionService.cleanupStaleTransactions();
}, 5 * 60 * 1000);