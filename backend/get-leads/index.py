import json
import os

def handler(event: dict, context) -> dict:
    """Возвращает список заявок для страницы администратора."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = event.get('headers') or {}
    admin_key = headers.get('X-Admin-Key') or headers.get('x-admin-key')
    if admin_key != os.environ.get('ADMIN_KEY'):
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }

    import psycopg2

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, phone, message, created_at FROM t_p67477362_next_gen_web.leads ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    leads = [
        {
            'id': row[0],
            'name': row[1],
            'phone': row[2],
            'message': row[3],
            'created_at': row[4].isoformat() if row[4] else None
        }
        for row in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'leads': leads})
    }
