import json

import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('127.0.0.1'))
channel = connection.channel()
channel.queue_declare(queue='whatsapp')

if __name__ == '__main__':
    mobile = input("Informe o numero do telefone com 55\n")

    while True:
        text = input("Informe o texto da sua mensagem\n")
        channel.basic_publish(exchange='',
                              routing_key='whatsapp',
                              body=json.dumps({"mobile": mobile, "text": text}))
