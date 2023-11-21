# Dependencies

- install `postgrest` https://postgrest.org/en/stable/
- run postgrest with `postgrest.conf` following `postgrest.conf.example`
  - change `db-uri` to a correct postgres path
- run `notification-service-nodejs` that controls a message queue
- create `.env` file following `.env.example`

# Build

- run `npm i && npm run build`

# Run

- run `npm run start`
