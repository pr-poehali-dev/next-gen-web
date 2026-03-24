import json
import os

def handler(event: dict, context) -> dict:
    """Сохраняет гарантийный талон покупателя в базу данных."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    import psycopg2

    body = json.loads(event.get('body') or '{}')
    full_name = body.get('full_name', '').strip()
    address = body.get('address', '').strip()
    purchase_date = body.get('purchase_date', '').strip()
    model = body.get('model', '').strip()

    if not full_name or not address or not purchase_date or not model:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Все поля обязательны'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p67477362_next_gen_web.warranties (full_name, address, purchase_date, model) VALUES (%s, %s, %s, %s) RETURNING id",
        (full_name, address, purchase_date, model)
    )
    warranty_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': warranty_id})
    }
