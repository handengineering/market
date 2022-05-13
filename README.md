# Hand Engineering Market

An online hub where users can enter raffles for limited-run product releases.

Users are verified by:

- Their account email matching their discord email
- They are a member of the Hand Engineering Discord
- A captcha upon signing up, and entering a raffle

To-do:

- [ ] Add the ability to automatically import products from Shopify
- [ ] Add the ability to manage products, and set quantity for raffle
- [ ] Add the ability to automatically send Shopify invoices to the account email
- [ ] Add the ability to automatically generate unique serial numbers for new products

## Development

a development environment can be run in a variety of ways. For simplicity there is a docker compose configuration file `docker-compose.yml` in the root of the repository that will start both the application itself and a postgres database for the backend, this configuration also exposes the node inspector on port 9229. If using [Visual Studio Code](https://code.visualstudio.com/) as your editor of choice there are simple debugging configurations for the front and back end in `.vscode/launch.json`.

To use this configuration you will need: [Docker Compose](https://docs.docker.com/compose/install/), [Docker](https://docs.docker.com/get-docker/) or equivalent container engine

To start the application:

```Shell
$ docker compose up
```

To stop the application:

```Shell
$ docker compose down
```

Alternative development mechanisms can be found in the [Remix documentation](https://remix.run/docs/en/v1)
