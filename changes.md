# notes

- if you want files and include to be empty → then define these explicitly in tsconfig, else it has a default value or it extends from base config.

# authentication compelete

- swagger added
- authentication refresh/access token with jwt
- redis added
  - to store otp for limited time.
  - 3 attempts for otp verification
- email otp

# later todo

- add notification service
  nx g @nx/nestjs:application apps/notification
  - make a nestjs async microservice. (use redis (if not then bullmq) as internal communication)
  - features: email, inapp, sms
