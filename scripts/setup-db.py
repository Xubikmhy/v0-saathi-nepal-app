#!/usr/bin/env python3
"""
Setup database for Nepal Models app
Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
"""

import os
import sys
from pathlib import Path

# Try to import postgres client
try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("❌ psycopg2 not installed. Install with: pip install psycopg2-binary")
    print("\n📋 Alternative: Run the SQL manually in Supabase dashboard")
    sys.exit(1)

def get_postgres_connection():
    """Get PostgreSQL connection string from Supabase"""
    postgres_url = os.getenv('POSTGRES_URL')
    if not postgres_url:
        return None
    return postgres_url

def execute_sql_file(cursor, file_path):
    """Execute SQL from a file"""
    with open(file_path, 'r') as f:
        sql_content = f.read()
    
    # Split by semicolon and execute each statement
    statements = [s.strip() for s in sql_content.split(';') if s.strip()]
    
    for statement in statements:
        print(f"  Executing: {statement[:60]}...")
        try:
            cursor.execute(statement)
            print(f"    ✅ Success")
        except Exception as e:
            print(f"    ⚠️  {str(e)}")

def main():
    print("🚀 Setting up Models database...\n")
    
    # Get connection
    postgres_url = get_postgres_connection()
    if not postgres_url:
        print("❌ POSTGRES_URL not set in environment")
        print("📋 Run the SQL manually in Supabase dashboard")
        sys.exit(1)
    
    print("1️⃣ Connecting to PostgreSQL...")
    try:
        conn = psycopg2.connect(postgres_url)
        cursor = conn.cursor()
        print("   ✅ Connected!\n")
    except Exception as e:
        print(f"   ❌ Connection failed: {e}")
        sys.exit(1)
    
    # Get SQL file
    sql_file = Path(__file__).parent / 'setup-models-table.sql'
    
    print("2️⃣ Executing SQL...\n")
    try:
        execute_sql_file(cursor, sql_file)
        conn.commit()
        print("\n✨ Database setup complete!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        conn.rollback()
        sys.exit(1)
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    main()
