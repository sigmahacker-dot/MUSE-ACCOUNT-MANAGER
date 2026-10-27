# Muse Account Manager (Termux)

A small **local record manager** for keeping track of accounts you already own or are authorized to manage. It does not create accounts, automate sign-ups, generate tokens, change location, or bypass a service's limits.

## Run on Android with Termux

```bash
pkg update
pkg install python git
git clone https://github.com/sigmahacker-dot/MUSE-ACCOUNT-MANAGER.git
cd MUSE-ACCOUNT-MANAGER
python main.py --help
```

## Commands

Add an account record:

```bash
python main.py add --email you@example.com --service "Muse AI" --label "personal"
```

List records:

```bash
python main.py list
```

Export records to CSV:

```bash
python main.py export --file accounts-export.csv
```

Remove a record:

```bash
python main.py remove --email you@example.com
```

Records are saved locally in `accounts.json`. **Do not store passwords, session cookies, API keys, or recovery codes** in this file. Keep the file private and make a secure backup if needed.
