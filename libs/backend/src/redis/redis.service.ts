import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;
  constructor() {
    const [host, port, password, username] = [
      process.env.REDIS_HOST,
      +process.env.REDIS_PORT,
      process.env.REDIS_PASSWORD,
      process.env.REDIS_USERNAME,
    ];

    const [ca, cert, key] = [
      process.env.REDIS_TLS_CA,
      process.env.REDIS_TLS_CERT,
      process.env.REDIS_TLS_KEY,
    ];

    const redisClientConfig: RedisOptions = {
      host,
      port,
      password,
      username,
    };

    // if all three exists
    if ([ca, cert, key].every(Boolean)) {
      redisClientConfig.tls = {
        ca,
        cert,
        key,
      };
    }

    this.redisClient = new Redis(redisClientConfig);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? this.deserializeValue<T>(value) : null;
  }

  /**
   *
   * @param key Redis Key
   * @param value Redis Value
   * @param ttl Expiry Time
   * @param handleError (Default true) Set false To Handle Redis Error manually
   */
  async set<T = any, H extends boolean = true>(
    key: string,
    value: T,
    ttl?: number,
    handleError?: H,
  ): Promise<H extends true ? 'OK' : 'OK' | undefined> {
    const serializedValue = this.serializeValue(value);
    const result = ttl
      ? await this.redisClient.set(key, serializedValue, 'EX', ttl)
      : await this.redisClient.set(key, serializedValue);
    if (!result) {
      console.warn(`Redis error: ${key} Not Found`);
      if (handleError) {
        throw new InternalServerErrorException({
          error: 'Something Went Wrong',
        });
      }
      return undefined as H extends true ? 'OK' : 'OK' | undefined;
    } else return result;
  }

  async dlt(...keys: string[]) {
    const deleted = await this.redisClient.del(...keys);

    const missing = keys.length - deleted;

    if (missing > 0) {
      console.warn('Not all keys deleted from redis', {
        requested: keys.length,
        deleted,
        missing,
        keys: keys,
      });
    }

    return deleted;
  }

  ttl(key: string) {
    return this.redisClient.ttl(key);
  }

  private serializeValue<T>(value: T): string {
    return JSON.stringify(value);
  }

  private deserializeValue<T>(value: string): T {
    return JSON.parse(value);
  }
}
