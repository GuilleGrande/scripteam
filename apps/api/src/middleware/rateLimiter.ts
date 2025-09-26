import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      // Get or create entry
      let entry = this.store[key];
      if (!entry || now > entry.resetTime) {
        entry = {
          count: 0,
          resetTime: now + this.windowMs
        };
        this.store[key] = entry;
      }

      // Check rate limit
      if (entry.count >= this.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

        res.set({
          'X-RateLimit-Limit': this.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
          'Retry-After': retryAfter.toString()
        });

        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        });
      }

      // Increment counter
      entry.count++;

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': this.maxRequests.toString(),
        'X-RateLimit-Remaining': (this.maxRequests - entry.count).toString(),
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
      });

      next();
    };
  }

  private getKey(req: Request): string {
    // Use IP address as the rate limiting key
    // In production, you might want to use user ID if authenticated
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Create rate limiters for different endpoints
export const uploadRateLimiter = new RateLimiter(
  5,          // 5 uploads
  60 * 1000   // per minute
);

export const generalRateLimiter = new RateLimiter(
  100,        // 100 requests
  60 * 1000   // per minute
);