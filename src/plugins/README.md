# Plugin architecture

Each plugin object has `name`, optional `aliases`, `category`, `description`, and async `run(ctx)`. Optional guards: `ownerOnly`, `groupOnly`.

Create a module under `src/plugins/` and register it in `src/plugins/index.js`. Test new commands only in chats/groups you control.