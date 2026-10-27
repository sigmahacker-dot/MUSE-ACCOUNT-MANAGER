#!/usr/bin/env python3
"""Local account-record manager for Termux. Does not create or automate accounts."""
import argparse
import csv
import json
from pathlib import Path
from datetime import datetime, timezone

DATA_FILE = Path(__file__).with_name("accounts.json")


def load_records():
    if not DATA_FILE.exists():
        return []
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        print("Error: accounts.json is unreadable. Back it up and check its contents.")
        raise SystemExit(1)


def save_records(records):
    DATA_FILE.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def add_record(args):
    email = args.email.strip()
    if not email or "@" not in email:
        raise SystemExit("Please provide a valid email address.")
    records = load_records()
    if any(r.get("email", "").casefold() == email.casefold() for r in records):
        raise SystemExit("That email is already in your records.")
    records.append({
        "email": email,
        "service": args.service.strip() or "Muse AI",
        "label": args.label.strip(),
        "notes": args.notes.strip(),
        "added_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    })
    save_records(records)
    print(f"Saved record for {email}.")


def list_records(_args):
    records = load_records()
    if not records:
        print("No records yet. Add one with: python main.py add")
        return
    for i, r in enumerate(records, 1):
        print(f'{i}. {r.get("email", "")} | {r.get("service", "Muse AI")} | {r.get("label", "")} | {r.get("added_at", "")}')
        if r.get("notes"):
            print(f'   Notes: {r["notes"]}')
    print(f"\nTotal: {len(records)}")


def export_records(args):
    records = load_records()
    target = Path(args.file)
    with target.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["email", "service", "label", "notes", "added_at"])
        writer.writeheader()
        writer.writerows(records)
    print(f"Exported {len(records)} record(s) to {target}")


def remove_record(args):
    records = load_records()
    matches = [r for r in records if r.get("email", "").casefold() == args.email.strip().casefold()]
    if not matches:
        raise SystemExit("Email not found.")
    records = [r for r in records if r.get("email", "").casefold() != args.email.strip().casefold()]
    save_records(records)
    print(f"Removed {args.email} from local records.")


def main():
    parser = argparse.ArgumentParser(description="Local account-record manager (not an account creator).")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="Save an account email record")
    add.add_argument("--email", required=True, help="Account email")
    add.add_argument("--service", default="Muse AI", help="Service name")
    add.add_argument("--label", default="", help="Optional label/status")
    add.add_argument("--notes", default="", help="Optional notes; do not store passwords or recovery codes")
    add.set_defaults(func=add_record)

    ls = sub.add_parser("list", help="List saved records")
    ls.set_defaults(func=list_records)

    exp = sub.add_parser("export", help="Export records to CSV")
    exp.add_argument("--file", default="accounts-export.csv", help="Output CSV filename")
    exp.set_defaults(func=export_records)

    rm = sub.add_parser("remove", help="Remove a record by email")
    rm.add_argument("--email", required=True, help="Email to remove")
    rm.set_defaults(func=remove_record)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
