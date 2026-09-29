# Production deployment (set up 2026-09-30)

Push to `main` → Drone (homelab, ci.octabits.org) runs `.drone.yml` → deploys to the prod host
`139.162.8.118` (Ubuntu 24.04, same box as muniif.org) as user `ci` over SSH. Same pattern as muniif-api / muniif-org.

| Repo | Domain | On the host | Runs as |
|---|---|---|---|
| ecom-api | api.scentology.bd | `/var/www/api.scentology.bd` (binary + config.yml) | supervisor `scentology_api` (127.0.0.1:8091) + `scentology_scheduler` |
| ecom-storefront | scentology.bd (www → apex) | `/var/www/scentology.bd` (`.output/` + `.env`) | supervisor `scentology_storefront` (node 22, 127.0.0.1:8092, `node --env-file=.env`) |
| ecom-admin | control.scentology.bd | `/var/www/control.scentology.bd` (static SPA from `nuxt generate`) | nginx only |

- Config lives in Consul (w2, `http://192.168.68.117:8500`), never in git: `apps/ecom-api/prod/config.yml`,
  `apps/ecom-admin/prod/.env`, `apps/ecom-storefront/prod/.env`. Edit there, then re-run the Drone build.
- Deploy SSH key is shared with muniif: `apps/muniif-org/prod/deploy_key`. `ci` may only `sudo supervisorctl`.
- Mongo (8.0) and Redis are local on the host, shared with muniif: db `scentology`, redis db 5/6, prefix `scentology_`.
  Passwords contain `#`, so keep them quoted in YAML.
- nginx vhosts `/etc/nginx/sites-available/{scentology.bd,control.scentology.bd,api.scentology.bd}.conf`; certs by
  certbot webroot `/var/www/acme` (Cloudflare proxies the domains). Logs: `/var/log/scentology_*.log`, `/var/log/nginx/*scentology*`.
- The API deploy runs `migration up` before restarting (idempotent) and health-checks `GET /storefront/info`.
