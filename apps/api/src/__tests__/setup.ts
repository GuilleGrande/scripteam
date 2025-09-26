// Test setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random port for tests

// Mock console methods to reduce noise in tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Basic setup test to ensure Jest is working
describe('Test Setup', () => {
  test('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});